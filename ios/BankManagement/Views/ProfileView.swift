import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Informations personnelles")) {
                    if let user = authViewModel.currentUser {
                        InfoRow(label: "Prénom", value: user.firstName)
                        InfoRow(label: "Nom", value: user.lastName)
                        InfoRow(label: "Email", value: user.email)
                    }
                }
                
                Section {
                    Button(action: {
                        authViewModel.logout()
                    }) {
                        HStack {
                            Spacer()
                            Text("Déconnexion")
                                .foregroundColor(.red)
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle("Profil")
        }
    }
}

