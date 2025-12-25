import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
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
import './Dashboard.css'

function Dashboard() {
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
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <span className="home-label">Home</span>
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
          <div className="transactions-list">
            {operations.slice(0, 5).map((op) => {
              const getTransactionName = () => {
                if (op.clientId && typeof op.clientId === 'object' && op.clientId.firstName) {
                  return `${op.clientId.firstName} ${op.clientId.lastName}`
                }
                if (op.type === 'deposit') return 'Dépôt'
                if (op.type === 'withdrawal') return 'Retrait'
                if (op.type === 'transfer') return 'Virement vers bénéficiaire'
                if (op.type === 'payment') return 'Paiement'
                return 'Transaction'
              }

              const getTransactionIcon = () => {
                if (op.clientId && typeof op.clientId === 'object' && op.clientId.firstName) {
                  return op.clientId.firstName?.charAt(0).toUpperCase() || 'B'
                }
                return op.type?.charAt(0).toUpperCase() || 'T'
              }

              const formatDate = (dateString) => {
                const date = new Date(dateString)
                return date.toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              }

              return (
                <div key={op._id} className="transaction-item">
                  <div className="transaction-icon">
                    <span className="transaction-letter">{getTransactionIcon()}</span>
                  </div>
                  <div className="transaction-info">
                    <h4 className="transaction-name">{getTransactionName()}</h4>
                    <p className="transaction-date">{formatDate(op.createdAt)}</p>
                  </div>
                  <div className={`transaction-amount ${op.type === 'deposit' ? 'positive' : 'negative'}`}>
                    {op.type === 'deposit' ? '+' : '-'}CHF {formatAmount(Math.abs(op.amount))}
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
        <Link to="/payments" className="nav-item">
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