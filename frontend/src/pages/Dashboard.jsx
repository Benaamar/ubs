import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  FiX,
  FiLogOut
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
  const navigate = useNavigate()
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

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer le token d'authentification du localStorage
    localStorage.removeItem('token')
    // Rediriger vers la page de login
    navigate('/login')
  }

  // Fonction pour gérer le clic sur une opération
  const handleOperationClick = (operation) => {
    // Stocker les détails de l'opération pour la page de détails
    localStorage.setItem('selectedOperation', JSON.stringify(operation))
    // Naviguer vers la page de détails
    navigate('/operation-details')
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

 {/* Trading Portfolio */}
<div className="trading-portfolio">
  <div className="portfolio-header">
    <span className="portfolio-dot"></span>
    <span className="portfolio-title">TradingPortfolio</span>
  </div>

  <div className="portfolio-stats">
  <div className="stat-item">
    <span className="stat-percentage positive">+2.04%</span>
    <span className="stat-amount positive">CHF 1'043</span>
    <span className="stat-zero">0%</span>
  </div>
</div>


  <div className="portfolio-chart">
  <svg viewBox="0 0 320 140" className="portfolio-svg">
    {/* Ligne 0% */}
    <line
      x1="0"
      y1="85"
      x2="320"
      y2="85"
      stroke="#d0d0d0"
      strokeDasharray="3 4"
      strokeWidth="1"
    />

    {/* Courbe */}
    <polyline
      points="0,90 40,95 80,65 120,70 160,45 200,60 240,55 280,45 320,35"
      fill="none"
      stroke="#5AA9E6"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Zone bleue */}
    <polygon
      points="0,90 40,95 80,65 120,70 160,45 200,60 240,55 280,45 320,35 320,120 0,120"
      fill="url(#blueGradient)"
    />

    <defs>
      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5AA9E6" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#5AA9E6" stopOpacity="0.05" />
      </linearGradient>
    </defs>
  </svg>
</div>

<div className="portfolio-footer">
  <span>31.12.2023</span>
<span className="stat-zero">0%</span>
  <span>09.08.2024</span>
</div>


  <div className="custody-row">
    <span>Custody account</span>
    <span>CHF 40'234</span>
  </div>
</div>


{/* Favorites */}
<div className="favorites-section">
  <div className="favorites-header">Favorites</div>

  <div className="favorite-item">
    <div className="favorite-left">
      <span className="favorite-icon">⛃</span>
      <div>
        <div className="favorite-label">Private account</div>
        <div className="favorite-amount">CHF 12'010.50</div>
      </div>
    </div>
    <span className="favorite-arrow">›</span>
  </div>

  <div className="favorite-divider"></div>

  <div className="favorite-item">
    <div className="favorite-left">
      <span className="favorite-icon savings-icon">
  <FiLayers size={18} />
</span>

      <div>
        <div className="favorite-label">Savings</div>
        <div className="favorite-amount">EUR 7'123.50</div>
      </div>
    </div>
    <span className="favorite-arrow">›</span>
  </div>
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
        <div className="sidebar-logout">
          <button 
            className="sidebar-nav-item logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut size={22} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard