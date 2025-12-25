import Foundation

struct Client: Codable, Identifiable {
    let id: String
    let userId: String
    let firstName: String
    let lastName: String
    let email: String
    let phone: String?
    let address: Address?
    let accountNumber: String
    let balance: Double
    let status: String
    let createdAt: String?
    let updatedAt: String?
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case userId
        case firstName
        case lastName
        case email
        case phone
        case address
        case accountNumber
        case balance
        case status
        case createdAt
        case updatedAt
    }
    
    var fullName: String {
        "\(firstName) \(lastName)"
    }
    
    var formattedBalance: String {
        String(format: "%.2f", balance)
    }
}

struct Address: Codable {
    let street: String?
    let city: String?
    let postalCode: String?
    let country: String?
}

struct ClientsResponse: Codable {
    let success: Bool
    let count: Int?
    let data: [Client]
    let message: String?
}

struct ClientResponse: Codable {
    let success: Bool
    let data: Client?
    let message: String?
}

