import Foundation
import SwiftUI

class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let tokenKey = "auth_token"
    private let userKey = "current_user"
    
    var token: String? {
        UserDefaults.standard.string(forKey: tokenKey)
    }
    
    init() {
        checkAuthentication()
    }
    
    func checkAuthentication() {
        if let token = token, !token.isEmpty {
            Task {
                await loadUser(token: token)
            }
        }
    }
    
    func login(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await APIService.shared.login(email: email, password: password)
            
            if response.success, let token = response.token, let user = response.user {
                await MainActor.run {
                    UserDefaults.standard.set(token, forKey: tokenKey)
                    saveUser(user)
                    self.currentUser = user
                    self.isAuthenticated = true
                    self.isLoading = false
                }
            } else {
                await MainActor.run {
                    self.errorMessage = response.message ?? "Erreur de connexion"
                    self.isLoading = false
                }
            }
        } catch {
            await MainActor.run {
                self.errorMessage = "Erreur de connexion: \(error.localizedDescription)"
                self.isLoading = false
            }
        }
    }
    
    func register(email: String, password: String, firstName: String, lastName: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await APIService.shared.register(email: email, password: password, firstName: firstName, lastName: lastName)
            
            if response.success, let token = response.token, let user = response.user {
                await MainActor.run {
                    UserDefaults.standard.set(token, forKey: tokenKey)
                    saveUser(user)
                    self.currentUser = user
                    self.isAuthenticated = true
                    self.isLoading = false
                }
            } else {
                await MainActor.run {
                    self.errorMessage = response.message ?? "Erreur d'inscription"
                    self.isLoading = false
                }
            }
        } catch {
            await MainActor.run {
                self.errorMessage = "Erreur d'inscription: \(error.localizedDescription)"
                self.isLoading = false
            }
        }
    }
    
    func logout() {
        UserDefaults.standard.removeObject(forKey: tokenKey)
        UserDefaults.standard.removeObject(forKey: userKey)
        currentUser = nil
        isAuthenticated = false
    }
    
    private func loadUser(token: String) async {
        do {
            let response = try await APIService.shared.getCurrentUser(token: token)
            if response.success, let user = response.user {
                await MainActor.run {
                    self.currentUser = user
                    self.isAuthenticated = true
                }
            } else {
                await MainActor.run {
                    self.logout()
                }
            }
        } catch {
            await MainActor.run {
                self.logout()
            }
        }
    }
    
    private func saveUser(_ user: User) {
        if let encoded = try? JSONEncoder().encode(user) {
            UserDefaults.standard.set(encoded, forKey: userKey)
        }
    }
}

