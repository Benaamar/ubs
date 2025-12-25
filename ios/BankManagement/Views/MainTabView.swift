import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        TabView {
            ClientsView()
                .tabItem {
                    Label("Clients", systemImage: "person.2.fill")
                }
            
            OperationsView()
                .tabItem {
                    Label("Opérations", systemImage: "arrow.left.arrow.right")
                }
            
            HistoryView()
                .tabItem {
                    Label("Historique", systemImage: "clock.fill")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profil", systemImage: "person.fill")
                }
        }
    }
}

