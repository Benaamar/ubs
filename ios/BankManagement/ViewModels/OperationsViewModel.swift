import Foundation
import SwiftUI

class OperationsViewModel: ObservableObject {
    @Published var operations: [Operation] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    var authViewModel: AuthViewModel
    
    init(authViewModel: AuthViewModel) {
        self.authViewModel = authViewModel
    }
    
    func loadOperations(clientId: String? = nil) async {
        guard let token = authViewModel.token else { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await APIService.shared.getOperations(token: token, clientId: clientId)
            await MainActor.run {
                if response.success {
                    self.operations = response.data
                } else {
                    self.errorMessage = response.message ?? "Erreur lors du chargement des opérations"
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
    
    func loadOperationHistory(clientId: String) async {
        guard let token = authViewModel.token else { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await APIService.shared.getOperationHistory(clientId: clientId, token: token)
            await MainActor.run {
                if response.success {
                    self.operations = response.data
                } else {
                    self.errorMessage = response.message ?? "Erreur lors du chargement de l'historique"
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
    
    func createOperation(clientId: String, type: OperationType, amount: Double, description: String?, recipientAccountNumber: String?) async -> Bool {
        guard let token = authViewModel.token else { return false }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let request = OperationCreateRequest(
                clientId: clientId,
                type: type.rawValue,
                amount: amount,
                description: description,
                recipientAccountNumber: recipientAccountNumber
            )
            let response = try await APIService.shared.createOperation(operation: request, token: token)
            
            await MainActor.run {
                if response.success {
                    Task {
                        await self.loadOperations(clientId: clientId)
                    }
                } else {
                    self.errorMessage = response.message ?? "Erreur lors de la création de l'opération"
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
}

