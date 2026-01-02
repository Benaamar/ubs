import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { 
  FiRepeat, 
  FiArrowRight, 
  FiArrowLeft,
  FiFilter,
  FiX,
  FiLoader,
  FiTrendingUp
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
import './Operations.css'

function Operations() {
  const navigate = useNavigate()
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadOperations()
  }, [])

  useEffect(() => {
    loadOperations()
  }, [filters])

  const loadOperations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)

      const response = await api.get(`/operations?${params.toString()}`)
      if (response.data.success) {
        const ops = response.data.data || []
        console.log('Operations loaded:', ops.map(op => ({
          id: op._id,
          type: op.type,
          clientId: op.clientId,
          hasClientData: op.clientId && typeof op.clientId === 'object',
          bankName: op.clientId?.bankName,
          accountNumber: op.clientId?.accountNumber,
          fullClient: op.clientId
        })))
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
      type: '',
      status: ''
    })
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length

  // Fonction pour formater les montants avec point pour décimales et apostrophe pour milliers
  const formatAmount = (amount) => {
    if (typeof amount !== 'number') return '0.00'
    return amount
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'")
  }

  // Fonction pour obtenir les 3 derniers chiffres du compte avec étoiles
  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return '***'
    const last3 = accountNumber.slice(-3)
    return `***${last3}`
  }

  // Fonction pour déterminer le type de carte (Visa ou Mastercard)
  const getCardType = (bankName) => {
    if (!bankName) return 'visa' // Par défaut Visa
    const name = bankName.toLowerCase()
    // Si le nom contient "mastercard" ou "master", retourner Mastercard
    if (name.includes('mastercard') || name.includes('master')) {
      return 'mastercard'
    }
    // Sinon, Visa par défaut
    return 'visa'
  }

  if (loading && operations.length === 0) {
    return (
      <div className="container">
        <div className="loading-container">
          <FiLoader className="spinner-icon" size={48} />
          <p>Chargement des opérations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-with-back">
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
            aria-label="Retour"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1>Liste des opérations</h1>
        </div>
        <Link to="/operations/new" className="btn btn-primary">
          <FiArrowRight size={18} />
          <span>Nouvelle opération</span>
        </Link>
      </div>

      <div className="card filters-card">
        <div className="filters-header" onClick={() => setShowFilters(!showFilters)}>
          <div className="filters-title">
            <FiFilter size={20} />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </div>
          <button 
            className="toggle-filters"
            onClick={(e) => {
              e.stopPropagation()
              setShowFilters(!showFilters)
            }}
          >
            {showFilters ? <FiX size={20} /> : <FiFilter size={20} />}
          </button>
        </div>

        <div className={`filters-content ${showFilters ? 'filters-visible' : ''}`}>
          <div className="filters-grid">
              <div className="form-group">
                <label>Type d'opération</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="deposit">Crédit (Dépôt)</option>
                  <option value="withdrawal">Débit (Retrait)</option>
                  <option value="transfer">Débit (Virement)</option>
                  <option value="payment">Débit (Paiement)</option>
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
                <label>&nbsp;</label>
                <button onClick={clearFilters} className="btn btn-secondary">
                  <FiX size={16} />
                  <span>Réinitialiser</span>
                </button>
              </div>
            </div>
        </div>
      </div>

      {operations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <FiTrendingUp size={64} />
          </div>
          <h3>Aucune opération trouvée</h3>
          <p>Vos opérations de crédit et débit apparaîtront ici</p>
          <Link to="/operations/new" className="btn btn-primary">
            <FiArrowRight size={18} />
            <span>Créer une opération</span>
          </Link>
        </div>
      ) : (
        <div className="operations-list">
          {operations
            .filter((op) => {
              // Afficher uniquement les opérations qui ont un client (transfers vers bénéficiaires)
              // Les dépôts admin (sans clientId) ne sont pas affichés ici
              return op.clientId && typeof op.clientId === 'object'
            })
            .map((op) => {
              const client = op.clientId
              if (!client || !client.bankName) {
                return null
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
                          {client.lastName && client.lastName !== client.bankName 
                            ? client.lastName 
                            : client.bankName}
                        </div>
                        <div className="operation-card-iban">
                          IBAN: {client.accountNumber || 'Non disponible'}
                        </div>
                        {op.adminAccountName && (
                          <div className="operation-card-source">
                            De: {op.adminAccountName}
                          </div>
                        )}
                        <div className="operation-card-datetime">
                          {formatDateTime(op.createdAt)}
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
      )}
    </div>
  )
}

export default Operations
