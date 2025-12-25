import Foundation

class APIService {
    static let shared = APIService()
    
    private let baseURL = "http://localhost:3000/api"
    
    private init() {}
    
    // MARK: - Auth
    func login(email: String, password: String) async throws -> AuthResponse {
        let url = URL(string: "\(baseURL)/auth/login")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(AuthResponse.self, from: data)
    }
    
    func register(email: String, password: String, firstName: String, lastName: String) async throws -> AuthResponse {
        let url = URL(string: "\(baseURL)/auth/register")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password, "firstName": firstName, "lastName": lastName]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(AuthResponse.self, from: data)
    }
    
    func getCurrentUser(token: String) async throws -> AuthResponse {
        let url = URL(string: "\(baseURL)/auth/me")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(AuthResponse.self, from: data)
    }
    
    // MARK: - Clients
    func getClients(token: String) async throws -> ClientsResponse {
        let url = URL(string: "\(baseURL)/clients")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(ClientsResponse.self, from: data)
    }
    
    func getClient(id: String, token: String) async throws -> ClientResponse {
        let url = URL(string: "\(baseURL)/clients/\(id)")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(ClientResponse.self, from: data)
    }
    
    func createClient(client: ClientCreateRequest, token: String) async throws -> ClientResponse {
        let url = URL(string: "\(baseURL)/clients")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        request.httpBody = try JSONEncoder().encode(client)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(ClientResponse.self, from: data)
    }
    
    func updateClient(id: String, client: ClientUpdateRequest, token: String) async throws -> ClientResponse {
        let url = URL(string: "\(baseURL)/clients/\(id)")!
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        request.httpBody = try JSONEncoder().encode(client)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(ClientResponse.self, from: data)
    }
    
    func deleteClient(id: String, token: String) async throws {
        let url = URL(string: "\(baseURL)/clients/\(id)")!
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        _ = try await URLSession.shared.data(for: request)
    }
    
    // MARK: - Operations
    func getOperations(token: String, clientId: String? = nil) async throws -> OperationsResponse {
        var urlString = "\(baseURL)/operations"
        if let clientId = clientId {
            urlString += "?clientId=\(clientId)"
        }
        let url = URL(string: urlString)!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(OperationsResponse.self, from: data)
    }
    
    func getOperationHistory(clientId: String, token: String) async throws -> OperationsResponse {
        let url = URL(string: "\(baseURL)/operations/history/\(clientId)")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(OperationsResponse.self, from: data)
    }
    
    func createOperation(operation: OperationCreateRequest, token: String) async throws -> OperationResponse {
        let url = URL(string: "\(baseURL)/operations")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        request.httpBody = try JSONEncoder().encode(operation)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(OperationResponse.self, from: data)
    }
}

// MARK: - Request Models
struct ClientCreateRequest: Codable {
    let firstName: String
    let lastName: String
    let email: String
    let phone: String?
    let address: Address?
}

struct ClientUpdateRequest: Codable {
    let firstName: String?
    let lastName: String?
    let email: String?
    let phone: String?
    let address: Address?
    let status: String?
}

struct OperationCreateRequest: Codable {
    let clientId: String
    let type: String
    let amount: Double
    let description: String?
    let recipientAccountNumber: String?
}

