import Foundation
import SwiftUI

class ClientsViewModel: ObservableObject {
    @Published var clients: [Client] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    var authViewModel: AuthViewModel
    
    init(authViewModel: AuthViewModel) {
        self.authViewModel = authViewModel
    }
    
    func loadClients() async {
        guard let token = authViewModel.token else { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await APIService.shared.getClients(token: token)
            await MainActor.run {
                if response.success {
                    self.clients = response.data
                } else {
                    self.errorMessage = response.message ?? "Erreur lors du chargement des clients"
                }
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.errorMessage = "Erreur: \(error.localizedDescription)"
                self.isLoading = false
            }
        }
    }
    
    func createClient(firstName: String, lastName: String, email: String, phone: String?) async -> Bool {
        guard let token = authViewModel.token else { return false }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let request = ClientCreateRequest(firstName: firstName, lastName: lastName, email: email, phone: phone, address: nil)
            let response = try await APIService.shared.createClient(client: request, token: token)
            
            await MainActor.run {
                if response.success {
                    Task {
                        await self.loadClients()
                    }
                } else {
                    self.errorMessage = response.message ?? "Erreur lors de la création"
                }
                self.isLoading = false
            }
            return response.success
        } catch {
            await MainActor.run {
                self.errorMessage = "Erreur: \(error.localizedDescription)"
                self.isLoading = false
            }
            return false
        }
    }
    
    func deleteClient(id: String) async {
        guard let token = authViewModel.token else { return }
        
        isLoading = true
        
        do {
            try await APIService.shared.deleteClient(id: id, token: token)
            await MainActor.run {
                Task {
                    await self.loadClients()
                }
            }
        } catch {
            await MainActor.run {
                self.errorMessage = "Erreur: \(error.localizedDescription)"
            }
        }
        
        isLoading = false
    }
}

