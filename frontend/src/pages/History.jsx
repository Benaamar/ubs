import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { 
  FiClock, 
  FiFilter, 
  FiX, 
  FiLoader,
  FiSearch,
  FiArrowLeft
} from 'react-icons/fi'
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
import './History.css'

function History() {
  const navigate = useNavigate()
  const [operations, setOperations] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    clientId: '',
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadClients()
    loadOperations()
  }, [])

  useEffect(() => {
    loadOperations()
  }, [filters])

  const loadClients = async () => {
    try {
      const response = await api.get('/clients')
      if (response.data.success) {
        setClients(response.data.data || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error)
    }
  }

  const loadOperations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.clientId) params.append('clientId', filters.clientId)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await api.get(`/operations?${params.toString()}`)
      if (response.data.success) {
        const ops = response.data.data || []
        setOperations(ops)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des opérations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const clearFilters = () => {
    setFilters({
      clientId: '',
      type: '',
      status: '',
      startDate: '',
      endDate: ''
    })
  }

  // Group operations by date
  const groupOperationsByDate = (ops) => {
    const grouped = {}
    const statusGroups = {}
    
    ops.forEach(op => {
      const date = new Date(op.createdAt)
      const dateKey = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      
      // Group pending operations separately
      if (op.status === 'pending') {
        if (!statusGroups['pending']) {
          statusGroups['pending'] = []
        }
        statusGroups['pending'].push(op)
      } else {
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(op)
      }
    })
    
    return { statusGroups, dateGroups: grouped }
  }

  const getOperationTypeLabel = (type) => {
    const labels = {
      deposit: 'DÉPÔT',
      withdrawal: 'RETRAIT',
      transfer: 'VIREMENT',
      payment: 'PAIEMENT'
    }
    return labels[type] || type.toUpperCase()
  }

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

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'EN TRAITEMENT',
      completed: 'TRAITÉ',
      failed: 'ÉCHOUÉ',
      cancelled: 'ANNULÉ'
    }
    return labels[status] || status.toUpperCase()
  }

  const filteredOperations = operations.filter(op => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const clientName = op.client 
        ? `${op.client.firstName} ${op.client.lastName}`.toLowerCase()
        : ''
      const description = (op.description || '').toLowerCase()
      const type = getOperationTypeLabel(op.type).toLowerCase()
      
      return clientName.includes(searchLower) || 
             description.includes(searchLower) ||
             type.includes(searchLower)
    }
    return true
  })

  const { statusGroups: filteredStatusGroups, dateGroups: filteredDateGroups } = 
    groupOperationsByDate(filteredOperations)

  if (loading && operations.length === 0) {
    return (
      <div className="history-container">
        <div className="loading-container">
          <FiLoader className="spinner-icon" size={48} />
          <p>Chargement de l'historique...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="page-header-with-back">
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
            aria-label="Retour"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1>Historique</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-wrapper">
          <FiSearch className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header" onClick={() => setShowFilters(!showFilters)}>
          <div className="filters-title">
            <FiFilter size={18} />
            <span>Filtres</span>
          </div>
          <button 
            className="toggle-filters"
            onClick={(e) => {
              e.stopPropagation()
              setShowFilters(!showFilters)
            }}
          >
            {showFilters ? <FiX size={18} /> : <FiFilter size={18} />}
          </button>
        </div>

        {showFilters && (
          <div className="filters-content">
            <div className="filters-grid">
              <div className="form-group">
                <label>Client</label>
                <select
                  value={filters.clientId}
                  onChange={(e) => handleFilterChange('clientId', e.target.value)}
                >
                  <option value="">Tous les clients</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="deposit">Dépôt</option>
                  <option value="withdrawal">Retrait</option>
                  <option value="transfer">Virement</option>
                  <option value="payment">Paiement</option>
                </select>
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Terminé</option>
                  <option value="failed">Échoué</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date début</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Date fin</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>&nbsp;</label>
                <button onClick={clearFilters} className="btn btn-secondary">
                  <FiX size={16} />
                  <span>Réinitialiser</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {operations.length > 0 && (
        <div className="recent-transactions">
          <div className="transactions-header">
            <h3 className="transactions-title">Transactions récentes</h3>
          </div>
          <div className="operations-list">
            {operations
              .slice(0, 10)
              .map((op) => {
                const client = op.clientId || op.client
                if (!client) {
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
    </div>
  )
}

export default History
