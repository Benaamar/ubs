import SwiftUI

struct ClientsView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var viewModel: ClientsViewModel
    @State private var showAddClient = false
    
    init() {
        _viewModel = StateObject(wrappedValue: ClientsViewModel(authViewModel: AuthViewModel()))
    }
    
    var body: some View {
        NavigationView {
            Group {
                if viewModel.isLoading && viewModel.clients.isEmpty {
                    ProgressView()
                } else if viewModel.clients.isEmpty {
                    VStack {
                        Image(systemName: "person.2.slash")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("Aucun client")
                            .font(.title2)
                            .foregroundColor(.gray)
                        Text("Ajoutez votre premier client")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                } else {
                    List {
                        ForEach(viewModel.clients) { client in
                            NavigationLink(destination: ClientDetailView(client: client, authViewModel: authViewModel)) {
                                ClientRowView(client: client)
                            }
                        }
                        .onDelete(perform: deleteClients)
                    }
                }
            }
            .navigationTitle("Clients")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showAddClient = true
                    }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddClient) {
                AddClientView(viewModel: viewModel)
            }
            .onAppear {
                viewModel.authViewModel = authViewModel
                Task {
                    await viewModel.loadClients()
                }
            }
            .refreshable {
                await viewModel.loadClients()
            }
        }
        .onAppear {
            // Update viewModel with the environment authViewModel
            if viewModel.authViewModel !== authViewModel {
                viewModel.authViewModel = authViewModel
            }
            Task {
                await viewModel.loadClients()
            }
        }
    }
    
    private func deleteClients(at offsets: IndexSet) {
        for index in offsets {
            let client = viewModel.clients[index]
            Task {
                await viewModel.deleteClient(id: client.id)
            }
        }
    }
}

struct ClientRowView: View {
    let client: Client
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(client.fullName)
                    .font(.headline)
                Text(client.email)
                    .font(.caption)
                    .foregroundColor(.gray)
                Text("N°: \(client.accountNumber)")
                    .font(.caption2)
                    .foregroundColor(.blue)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 4) {
                Text("\(client.formattedBalance) CHF")
                    .font(.headline)
                    .foregroundColor(.green)
                Text(client.status)
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
    
    private var statusColor: Color {
        switch client.status {
        case "active": return .green
        case "inactive": return .gray
        case "suspended": return .red
        default: return .gray
        }
    }
}

struct ClientDetailView: View {
    let client: Client
    @StateObject private var operationsViewModel: OperationsViewModel
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var showAddOperation = false
    
    init(client: Client, authViewModel: AuthViewModel) {
        self.client = client
        _operationsViewModel = StateObject(wrappedValue: OperationsViewModel(authViewModel: authViewModel))
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Balance Card
                VStack(alignment: .leading, spacing: 10) {
                    Text("Solde")
                        .font(.caption)
                        .foregroundColor(.gray)
                    Text("\(client.formattedBalance) CHF")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundColor(.green)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(12)
                
                // Client Info
                VStack(alignment: .leading, spacing: 12) {
                    Text("Informations")
                        .font(.headline)
                    
                    InfoRow(label: "Nom complet", value: client.fullName)
                    InfoRow(label: "Email", value: client.email)
                    if let phone = client.phone {
                        InfoRow(label: "Téléphone", value: phone)
                    }
                    InfoRow(label: "Numéro de compte", value: client.accountNumber)
                    InfoRow(label: "Statut", value: client.status)
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(12)
                
                // Recent Operations
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Opérations récentes")
                            .font(.headline)
                        Spacer()
                        Button("Voir tout") {
                            // Navigate to history
                        }
                        .font(.caption)
                    }
                    
                    if operationsViewModel.isLoading {
                        ProgressView()
                    } else if operationsViewModel.operations.isEmpty {
                        Text("Aucune opération")
                            .font(.caption)
                            .foregroundColor(.gray)
                    } else {
                        ForEach(operationsViewModel.operations.prefix(5)) { operation in
                            OperationRowView(operation: operation)
                        }
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(12)
                
                Button(action: {
                    showAddOperation = true
                }) {
                    Text("Nouvelle opération")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            }
            .padding()
        }
        .navigationTitle(client.fullName)
        .navigationBarTitleDisplayMode(.large)
        .sheet(isPresented: $showAddOperation) {
            AddOperationView(client: client, operationsViewModel: operationsViewModel, authViewModel: authViewModel)
        }
        .onAppear {
            operationsViewModel.authViewModel = authViewModel
            Task {
                await operationsViewModel.loadOperationHistory(clientId: client.id)
            }
        }
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.gray)
            Spacer()
            Text(value)
                .fontWeight(.medium)
        }
    }
}

struct AddClientView: View {
    @ObservedObject var viewModel: ClientsViewModel
    @Environment(\.dismiss) var dismiss
    
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Informations du client")) {
                    TextField("Prénom", text: $firstName)
                    TextField("Nom", text: $lastName)
                    TextField("Email", text: $email)
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)
                    TextField("Téléphone (optionnel)", text: $phone)
                        .keyboardType(.phonePad)
                }
                
                if let errorMessage = viewModel.errorMessage {
                    Section {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("Nouveau client")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Ajouter") {
                        Task {
                            let success = await viewModel.createClient(
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                phone: phone.isEmpty ? nil : phone
                            )
                            if success {
                                dismiss()
                            }
                        }
                    }
                    .disabled(firstName.isEmpty || lastName.isEmpty || email.isEmpty || viewModel.isLoading)
                }
            }
        }
    }
}

