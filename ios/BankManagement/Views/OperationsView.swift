import SwiftUI

struct OperationsView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var operationsViewModel: OperationsViewModel
    @StateObject private var clientsViewModel: ClientsViewModel
    @State private var showAddOperation = false
    @State private var selectedClientId: String? = nil
    
    init() {
        _operationsViewModel = StateObject(wrappedValue: OperationsViewModel(authViewModel: AuthViewModel()))
        _clientsViewModel = StateObject(wrappedValue: ClientsViewModel(authViewModel: AuthViewModel()))
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Filter by client
                if !clientsViewModel.clients.isEmpty {
                    Picker("Client", selection: $selectedClientId) {
                        Text("Tous les clients").tag(String?.none)
                        ForEach(clientsViewModel.clients) { client in
                            Text(client.fullName).tag(String?.some(client.id))
                        }
                    }
                    .pickerStyle(.menu)
                    .padding(.horizontal)
                }
                
                if operationsViewModel.isLoading && operationsViewModel.operations.isEmpty {
                    ProgressView()
                        .frame(maxHeight: .infinity)
                } else if operationsViewModel.operations.isEmpty {
                    VStack {
                        Image(systemName: "arrow.left.arrow.right")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("Aucune opération")
                            .font(.title2)
                            .foregroundColor(.gray)
                        Text("Créez votre première opération")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    .frame(maxHeight: .infinity)
                } else {
                    List {
                        ForEach(operationsViewModel.operations) { operation in
                            OperationRowView(operation: operation)
                        }
                    }
                }
            }
            .navigationTitle("Opérations")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showAddOperation = true
                    }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddOperation) {
                AddOperationView(client: nil, operationsViewModel: operationsViewModel, authViewModel: authViewModel)
            }
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
}

struct OperationRowView: View {
    let operation: Operation
    
    var body: some View {
        HStack {
            // Icon based on type
            Image(systemName: operationIcon)
                .font(.title2)
                .foregroundColor(operationColor)
                .frame(width: 40, height: 40)
                .background(operationColor.opacity(0.1))
                .cornerRadius(8)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(operation.typeDisplayName)
                    .font(.headline)
                if let description = operation.description {
                    Text(description)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                if let client = operation.client {
                    Text(client.fullName)
                        .font(.caption2)
                        .foregroundColor(.blue)
                }
                if let date = operation.createdAt {
                    Text(formatDate(date))
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text("\(operation.type == .deposit ? "+" : "-")\(operation.formattedAmount) CHF")
                    .font(.headline)
                    .foregroundColor(operationColor)
                Text(operation.statusDisplayName)
                    .font(.caption)
                    .foregroundColor(statusColor)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(statusColor.opacity(0.1))
                    .cornerRadius(8)
            }
        }
        .padding(.vertical, 4)
    }
    
    private var operationIcon: String {
        switch operation.type {
        case .deposit: return "arrow.down.circle.fill"
        case .withdrawal: return "arrow.up.circle.fill"
        case .transfer: return "arrow.left.arrow.right.circle.fill"
        case .payment: return "creditcard.fill"
        }
    }
    
    private var operationColor: Color {
        switch operation.type {
        case .deposit: return .green
        case .withdrawal, .payment: return .red
        case .transfer: return .blue
        }
    }
    
    private var statusColor: Color {
        switch operation.status {
        case .completed: return .green
        case .pending: return .orange
        case .failed: return .red
        case .cancelled: return .gray
        }
    }
    
    private func formatDate(_ dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = formatter.date(from: dateString) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateStyle = .short
            displayFormatter.timeStyle = .short
            return displayFormatter.string(from: date)
        }
        return dateString
    }
}

struct AddOperationView: View {
    let client: Client?
    @ObservedObject var operationsViewModel: OperationsViewModel
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var clientsViewModel: ClientsViewModel
    @Environment(\.dismiss) var dismiss
    
    @State private var selectedClientId: String = ""
    @State private var operationType: OperationType = .deposit
    @State private var amount: String = ""
    @State private var description: String = ""
    @State private var recipientAccountNumber: String = ""
    
    init(client: Client?, operationsViewModel: OperationsViewModel, authViewModel: AuthViewModel) {
        self.client = client
        self.operationsViewModel = operationsViewModel
        _clientsViewModel = StateObject(wrappedValue: ClientsViewModel(authViewModel: authViewModel))
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Client")) {
                    if let client = client {
                        Text(client.fullName)
                            .foregroundColor(.gray)
                    } else {
                        Picker("Client", selection: $selectedClientId) {
                            Text("Sélectionner un client").tag("")
                            ForEach(clientsViewModel.clients) { client in
                                Text(client.fullName).tag(client.id)
                            }
                        }
                    }
                }
                
                Section(header: Text("Type d'opération")) {
                    Picker("Type", selection: $operationType) {
                        Text("Dépôt").tag(OperationType.deposit)
                        Text("Retrait").tag(OperationType.withdrawal)
                        Text("Virement").tag(OperationType.transfer)
                        Text("Paiement").tag(OperationType.payment)
                    }
                }
                
                Section(header: Text("Montant")) {
                    TextField("Montant", text: $amount)
                        .keyboardType(.decimalPad)
                }
                
                Section(header: Text("Description (optionnel)")) {
                    TextField("Description", text: $description)
                }
                
                if operationType == .transfer {
                    Section(header: Text("Compte destinataire")) {
                        TextField("Numéro de compte", text: $recipientAccountNumber)
                    }
                }
                
                if let errorMessage = operationsViewModel.errorMessage {
                    Section {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("Nouvelle opération")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Créer") {
                        let clientId = client?.id ?? selectedClientId
                        guard !clientId.isEmpty,
                              let amountValue = Double(amount),
                              amountValue > 0 else { return }
                        
                        Task {
                            let success = await operationsViewModel.createOperation(
                                clientId: clientId,
                                type: operationType,
                                amount: amountValue,
                                description: description.isEmpty ? nil : description,
                                recipientAccountNumber: recipientAccountNumber.isEmpty ? nil : recipientAccountNumber
                            )
                            if success {
                                dismiss()
                            }
                        }
                    }
                    .disabled(
                        (client == nil && selectedClientId.isEmpty) ||
                        amount.isEmpty ||
                        Double(amount) == nil ||
                        (operationType == .transfer && recipientAccountNumber.isEmpty) ||
                        operationsViewModel.isLoading
                    )
                }
            }
            .onAppear {
                clientsViewModel.authViewModel = authViewModel
                if let client = client {
                    selectedClientId = client.id
                }
                Task {
                    await clientsViewModel.loadClients()
                }
            }
        }
    }
}

