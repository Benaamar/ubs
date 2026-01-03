import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { 
  FiUser, 
  FiMoreHorizontal,
  FiMessageSquare,
  FiArrowRight,
  FiLoader,
  FiPlus,
  FiHome,
  FiRepeat,
  FiCreditCard,
  FiLayers,
  FiSend,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiClock,
  FiX
} from 'react-icons/fi'
import { BiQrScan, BiMessage } from 'react-icons/bi'
// Composants pour les icônes de cartes depuis Icons8
const VisaIcon = ({ size = 32, className = '' }) => (
  <img 
    src="https://img.icons8.com/color/48/visa.png" 
    alt="Visa" 
    width={size} 
    height={size * 0.6}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)

const MastercardIcon = ({ size = 32, className = '' }) => (
  <img 
    src="https://img.icons8.com/color/48/mastercard.png" 
    alt="Mastercard" 
    width={size} 
    height={size * 0.6}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [operations, setOperations] = useState([])
  const [adminBalance, setAdminBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showBalance, setShowBalance] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [clientsRes, operationsRes] = await Promise.all([
        api.get('/clients'),
        api.get('/operations')
      ])

      setClients(clientsRes.data.data || [])
      
      // Charger les opérations avec les données du client populées
      const allOperations = operationsRes.data.data || []
      console.log('Operations loaded:', allOperations.map(op => ({
        id: op._id,
        type: op.type,
        clientId: op.clientId,
        hasClientData: op.clientId && typeof op.clientId === 'object'
      })))
      
      // Charger les 10 dernières opérations pour l'affichage
      const recentOperations = allOperations.slice(0, 10)
      setOperations(recentOperations)

      // Calculer le solde admin à partir de toutes les opérations complétées
      let balance = 0
      allOperations.forEach(op => {
        if (op.status === 'completed') {
          if (op.type === 'deposit') {
            balance += op.amount
          } else {
            balance -= op.amount
          }
        }
      })
      setAdminBalance(balance)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return client.status === 'active'
    if (activeTab === 'inactive') return client.status === 'inactive'
    return true
  }).filter(client =>
    (client.firstName && client.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.accountNumber.includes(searchTerm)
  )

  const activeClients = clients.filter(c => c.status === 'active').length
  const pendingOperations = operations.filter(op => op.status === 'pending').length

  // Fonction pour formater les montants avec point pour décimales et apostrophe pour milliers
  const formatAmount = (amount) => {
    const fixed = amount.toFixed(2)
    const parts = fixed.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]
    
    // Ajouter l'apostrophe tous les 3 chiffres en partant de la droite
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")
    
    return `${formattedInteger}.${decimalPart}`
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <FiLoader className="spinner-icon" size={48} />
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="profile-section">
              <button 
                className="profile-avatar"
                onClick={() => setSidebarOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <FiUser size={24} />
              </button>
              <div className="home-section">
                <span className="home-label">Home</span>
                {user && (
                  <span className="greeting-text">
                    Bonjour Monsieur {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.firstName || user.lastName || ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="header-right">
            <button className="header-icon-btn">
              <FiMoreHorizontal size={24} />
            </button>
            <button className="header-icon-btn notification-btn">
              <BiMessage size={24} />
              {pendingOperations > 0 && (
                <span className="notification-badge">{pendingOperations}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/operations/scan" className="quick-action-item">
          <div className="quick-action-icon scan-icon">
            <BiQrScan size={24} />
          </div>
          <span className="quick-action-label">Scan & Pay</span>
        </Link>
        <Link to="/balance/load" className="quick-action-item">
          <div className="quick-action-icon load-icon">
            <FiCreditCard size={24} />
          </div>
          <span className="quick-action-label">Charger la carte</span>
        </Link>
        <Link to="/operations/transfer" className="quick-action-item">
          <div className="quick-action-icon transfer-icon">
            <FiSend size={24} />
          </div>
          <span className="quick-action-label">Transfert</span>
        </Link>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <div className="balance-icon">
            <FiLayers size={20} />
          </div>
          <span className="balance-title">Mon Compte</span>
          <div className="balance-header-actions">
            <button 
              className="eye-btn"
              onClick={() => setShowBalance(!showBalance)}
              aria-label={showBalance ? "Masquer le solde" : "Afficher le solde"}
            >
              {showBalance ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            <FiArrowRight size={18} className="balance-arrow" />
          </div>
        </div>
        <div className="balance-amount">
          <span className="currency">CHF</span>
          <span className="amount">
            {showBalance ? (
              formatAmount(adminBalance)
            ) : (
              '••••••'
            )}
          </span>
        </div>
      </div>

      {/* Recent Transactions */}
      {operations.length > 0 && (
        <div className="recent-transactions">
          <div className="transactions-header">
            <h3 className="transactions-title">Transactions récentes</h3>
          </div>
          <div className="operations-list">
            {operations
              .filter((op) => {
                // Afficher uniquement les opérations qui ont un client (transfers vers bénéficiaires)
                // Les dépôts admin (sans clientId) ne sont pas affichés ici
                return op.clientId && typeof op.clientId === 'object'
              })
              .slice(0, 5)
              .map((op) => {
                const client = op.clientId
                if (!client || !client.bankName) {
                  return null
                }

                // Fonction pour obtenir les 3 derniers chiffres du compte avec étoiles
                const formatAccountNumber = (accountNumber) => {
                  if (!accountNumber) return '***'
                  const last3 = accountNumber.slice(-3)
                  return `***${last3}`
                }

                // Fonction pour déterminer le type de carte (Visa ou Mastercard)
                const getCardType = (bankName) => {
                  if (!bankName) return 'visa'
                  const name = bankName.toLowerCase()
                  if (name.includes('master')) return 'mastercard'
                  return 'visa'
                }

                const cardType = getCardType(client.bankName)
                // Les virements (transfer) sont des débits (sortie d'argent vers bénéficiaire)
                // Seuls les deposits sont des crédits (entrée d'argent)
                const isIncoming = op.type === 'deposit'

                // Formater la date et l'heure
                const formatDateTime = (dateString) => {
                  const date = new Date(dateString)
                  const today = new Date()
                  const yesterday = new Date(today)
                  yesterday.setDate(yesterday.getDate() - 1)
                  
                  const time = date.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
                  
                  // Si c'est aujourd'hui
                  if (date.toDateString() === today.toDateString()) {
                    return `Aujourd'hui à ${time}`
                  }
                  // Si c'est hier
                  if (date.toDateString() === yesterday.toDateString()) {
                    return `Hier à ${time}`
                  }
                  // Sinon afficher la date complète
                  const dateStr = date.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })
                  return `${dateStr} à ${time}`
                }

                return (
                  <div key={op._id} className="operation-card">
                    <div className="operation-card-content">
                      <div className="operation-card-bank">
                        {cardType === 'visa' ? (
                          <VisaIcon size={36} />
                        ) : (
                          <MastercardIcon size={36} />
                        )}

                        <div className="operation-card-bank-info">
                          <div className="operation-card-beneficiary-name">
                            {client.firstName && client.firstName.trim() 
                              ? `${client.firstName} ${client.lastName}` 
                              : client.lastName}
                          </div>
                          <div className="operation-card-iban">
                            IBAN: {client.accountNumber || 'Non disponible'}
                          </div>
                          <div className="operation-card-bank-name">
                            Banque: {client.bankName || 'Non spécifiée'}
                          </div>
                          {op.adminAccountName && (
                            <div className="operation-card-source">
                              De: {op.adminAccountName}
                            </div>
                          )}
                          <div className="operation-card-datetime">
                            {formatDateTime(op.createdAt)}
                          </div>
                          <div className="operation-card-account">
                            Compte: ***{formatAccountNumber(client.accountNumber)}
                          </div>
                          <div
                            className={`operation-card-amount ${
                              isIncoming ? 'amount-positive' : 'amount-negative'
                            }`}
                          >
                            CHF {isIncoming ? '+' : '-'}{formatAmount(op.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Decorative Background */}
      <div className="decorative-background">
        <div className="balloon balloon-1"></div>
        <div className="balloon balloon-2"></div>
        <div className="balloon balloon-3"></div>
      </div>


      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/" className="nav-item active">
          <FiHome size={24} />
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/operations/new" className="nav-item">
          <FiRepeat size={24} />
          <span className="nav-label">Paiements</span>
        </Link>
        <Link to="/accounts" className="nav-item">
          <FiLayers size={24} />
          <span className="nav-label">Comptes</span>
        </Link>
        <Link to="/cards" className="nav-item">
          <FiCreditCard size={24} />
          <span className="nav-label">Cartes</span>
        </Link>
        <Link to="/more" className="nav-item">
          <FiMoreHorizontal size={24} />
          <span className="nav-label">Plus</span>
        </Link>
      </div>

      {/* Sidebar Menu */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className="sidebar-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <FiHome size={22} />
            <span>Accueil</span>
          </Link>
          <Link 
            to="/clients" 
            className="sidebar-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <FiUsers size={22} />
            <span>Bénéficiaires</span>
          </Link>
          <Link 
            to="/operations" 
            className="sidebar-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <FiRepeat size={22} />
            <span>Opérations</span>
          </Link>
          <Link 
            to="/history" 
            className="sidebar-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <FiClock size={22} />
            <span>Historique</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Dashboard