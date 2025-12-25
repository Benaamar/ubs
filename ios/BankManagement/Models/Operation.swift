import Foundation

struct Operation: Codable, Identifiable {
    let id: String
    let userId: String
    let clientId: String
    let type: OperationType
    let amount: Double
    let description: String?
    let recipientAccountNumber: String?
    let status: OperationStatus
    let balanceAfter: Double?
    let createdAt: String?
    let updatedAt: String?
    let client: ClientInfo?
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case userId
        case clientId
        case type
        case amount
        case description
        case recipientAccountNumber
        case status
        case balanceAfter
        case createdAt
        case updatedAt
        case client
    }
    
    var formattedAmount: String {
        String(format: "%.2f", amount)
    }
    
    var typeDisplayName: String {
        switch type {
        case .deposit: return "Dépôt"
        case .withdrawal: return "Retrait"
        case .transfer: return "Virement"
        case .payment: return "Paiement"
        }
    }
    
    var statusDisplayName: String {
        switch status {
        case .pending: return "En attente"
        case .completed: return "Terminé"
        case .failed: return "Échoué"
        case .cancelled: return "Annulé"
        }
    }
}

enum OperationType: String, Codable {
    case deposit = "deposit"
    case withdrawal = "withdrawal"
    case transfer = "transfer"
    case payment = "payment"
}

enum OperationStatus: String, Codable {
    case pending = "pending"
    case completed = "completed"
    case failed = "failed"
    case cancelled = "cancelled"
}

struct ClientInfo: Codable {
    let id: String
    let firstName: String
    let lastName: String
    let accountNumber: String
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case firstName
        case lastName
        case accountNumber
    }
    
    var fullName: String {
        "\(firstName) \(lastName)"
    }
}

struct OperationsResponse: Codable {
    let success: Bool
    let count: Int?
    let data: [Operation]
    let message: String?
}

struct OperationResponse: Codable {
    let success: Bool
    let data: Operation?
    let message: String?
}

