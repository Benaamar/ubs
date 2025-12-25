import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var operationsViewModel: OperationsViewModel
    @StateObject private var clientsViewModel: ClientsViewModel
    @State private var selectedClientId: String? = nil
    @State private var selectedType: OperationType? = nil
    @State private var selectedStatus: OperationStatus? = nil
    
    init() {
        _operationsViewModel = StateObject(wrappedValue: OperationsViewModel(authViewModel: AuthViewModel()))
        _clientsViewModel = StateObject(wrappedValue: ClientsViewModel(authViewModel: AuthViewModel()))
    }
    
    var filteredOperations: [Operation] {
        var operations = operationsViewModel.operations
        
        if let selectedType = selectedType {
            operations = operations.filter { $0.type == selectedType }
        }
        
        if let selectedStatus = selectedStatus {
            operations = operations.filter { $0.status == selectedStatus }
        }
        
        return operations
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Filters
                VStack(spacing: 12) {
                    if !clientsViewModel.clients.isEmpty {
                        Picker("Client", selection: $selectedClientId) {
                            Text("Tous les clients").tag(String?.none)
                            ForEach(clientsViewModel.clients) { client in
                                Text(client.fullName).tag(String?.some(client.id))
                            }
                        }
                        .pickerStyle(.menu)
                    }
                    
                    HStack {
                        Picker("Type", selection: $selectedType) {
                            Text("Tous les types").tag(OperationType?.none)
                            Text("Dépôt").tag(OperationType?.some(.deposit))
                            Text("Retrait").tag(OperationType?.some(.withdrawal))
                            Text("Virement").tag(OperationType?.some(.transfer))
                            Text("Paiement").tag(OperationType?.some(.payment))
                        }
                        .pickerStyle(.menu)
                        
                        Picker("Statut", selection: $selectedStatus) {
                            Text("Tous les statuts").tag(OperationStatus?.none)
                            Text("Terminé").tag(OperationStatus?.some(.completed))
                            Text("En attente").tag(OperationStatus?.some(.pending))
                            Text("Échoué").tag(OperationStatus?.some(.failed))
                            Text("Annulé").tag(OperationStatus?.some(.cancelled))
                        }
                        .pickerStyle(.menu)
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                
                // Statistics
                if !filteredOperations.isEmpty {
                    HStack(spacing: 20) {
                        StatCard(
                            title: "Total",
                            value: String(format: "%.2f", totalAmount),
                            color: .blue
                        )
                        StatCard(
                            title: "Dépôts",
                            value: String(format: "%.2f", depositsAmount),
                            color: .green
                        )
                        StatCard(
                            title: "Retraits",
                            value: String(format: "%.2f", withdrawalsAmount),
                            color: .red
                        )
                    }
                    .padding()
                }
                
                // Operations List
                if operationsViewModel.isLoading && operationsViewModel.operations.isEmpty {
                    ProgressView()
                        .frame(maxHeight: .infinity)
                } else if filteredOperations.isEmpty {
                    VStack {
                        Image(systemName: "clock.badge.xmark")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("Aucune opération")
                            .font(.title2)
                            .foregroundColor(.gray)
                        Text("Aucune opération ne correspond aux filtres")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    .frame(maxHeight: .infinity)
                } else {
                    List {
                        ForEach(groupedOperations.keys.sorted(by: >), id: \.self) { date in
                            Section(header: Text(formatDateHeader(date))) {
                                ForEach(groupedOperations[date] ?? []) { operation in
                                    OperationRowView(operation: operation)
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Historique")
            .onAppear {
                operationsViewModel.authViewModel = authViewModel
                clientsViewModel.authViewModel = authViewModel
                Task {
                    await clientsViewModel.loadClients()
                    await operationsViewModel.loadOperations(clientId: selectedClientId)
                }
            }
            .onChange(of: selectedClientId) { newValue in
                Task {
                    await operationsViewModel.loadOperations(clientId: newValue)
                }
            }
            .refreshable {
                await operationsViewModel.loadOperations(clientId: selectedClientId)
            }
        }
    }
    
    private var totalAmount: Double {
        filteredOperations.reduce(0) { total, op in
            total + (op.type == .deposit ? op.amount : -op.amount)
        }
    }
    
    private var depositsAmount: Double {
        filteredOperations
            .filter { $0.type == .deposit }
            .reduce(0) { $0 + $1.amount }
    }
    
    private var withdrawalsAmount: Double {
        filteredOperations
            .filter { $0.type == .withdrawal || $0.type == .payment || $0.type == .transfer }
            .reduce(0) { $0 + $1.amount }
    }
    
    private var groupedOperations: [String: [Operation]] {
        Dictionary(grouping: filteredOperations) { operation in
            guard let dateString = operation.createdAt else { return "Autre" }
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = formatter.date(from: dateString) {
                let dateFormatter = DateFormatter()
                dateFormatter.dateFormat = "yyyy-MM-dd"
                return dateFormatter.string(from: date)
            }
            return "Autre"
        }
    }
    
    private func formatDateHeader(_ dateString: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        if let date = formatter.date(from: dateString) {
            formatter.dateStyle = .full
            formatter.timeStyle = .none
            return formatter.string(from: date)
        }
        return dateString
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Text(title)
                .font(.caption)
                .foregroundColor(.gray)
            Text("\(value) CHF")
                .font(.headline)
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(color.opacity(0.1))
        .cornerRadius(10)
    }
}

