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
        setOperations(response.data.data || [])
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
          <h1>Gestion des Opérations</h1>
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
        <div className="card">
          <div className="card-header">
            <h2>
              <FiRepeat size={24} />
              Opérations du compte principal ({operations.length})
            </h2>
            <p className="card-subtitle">Crédits et débits de votre compte</p>
          </div>
          
          {/* Desktop Table View */}
          <div className="table-container">
            <table className="operations-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Bénéficiaire / Description</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op) => (
                  <tr key={op._id}>
                    <td>
                      <span className={`badge badge-${op.type}`}>
                        {op.type === 'deposit' ? 'Crédit (Dépôt)' : 
                         op.type === 'withdrawal' ? 'Débit (Retrait)' :
                         op.type === 'transfer' ? 'Débit (Virement)' : 'Débit (Paiement)'}
                      </span>
                    </td>
                    <td>
                      {op.clientId && typeof op.clientId === 'object' && op.clientId.firstName ? (
                        <Link to={`/clients/${op.clientId._id || op.clientId}`} className="client-link">
                          {op.clientId.firstName} {op.clientId.lastName}
                        </Link>
                      ) : op.description ? (
                        <span>{op.description}</span>
                      ) : (
                        'Opération'
                      )}
                    </td>
                    <td className="amount-cell">
                      <span className={op.type === 'deposit' ? 'amount-positive' : 'amount-negative'}>
                        {op.type === 'deposit' ? '+' : '-'}{op.amount.toFixed(2)} €
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${op.status}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(op.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      {op.clientId && typeof op.clientId === 'object' && op.clientId.firstName && (
                        <Link to={`/clients/${op.clientId._id || op.clientId}`} className="action-link">
                          Voir Bénéficiaire →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="operations-mobile-list">
            {operations.map((op) => (
              <div key={op._id} className="operation-card-mobile">
                <div className="operation-card-mobile-header">
                  <div className="operation-card-mobile-type">
                    <span className={`badge badge-${op.type}`}>
                      {op.type === 'deposit' ? 'Crédit (Dépôt)' : 
                       op.type === 'withdrawal' ? 'Débit (Retrait)' :
                       op.type === 'transfer' ? 'Débit (Virement)' : 'Débit (Paiement)'}
                    </span>
                    <span className={`badge badge-${op.status}`}>
                      {op.status}
                    </span>
                  </div>
                  <div className={`operation-card-mobile-amount ${op.type === 'deposit' ? 'amount-positive' : 'amount-negative'}`}>
                    {op.type === 'deposit' ? '+' : '-'}{op.amount.toFixed(2)} €
                  </div>
                </div>
                <div className="operation-card-mobile-body">
                  <div className="operation-card-mobile-row">
                    <span className="operation-card-mobile-label">Bénéficiaire</span>
                    <span className="operation-card-mobile-value">
                      {op.clientId && typeof op.clientId === 'object' && op.clientId.firstName ? (
                        <Link to={`/clients/${op.clientId._id || op.clientId}`} className="client-link">
                          {op.clientId.firstName} {op.clientId.lastName}
                        </Link>
                      ) : op.description ? (
                        op.description
                      ) : (
                        'Opération'
                      )}
                    </span>
                  </div>
                  <div className="operation-card-mobile-row">
                    <span className="operation-card-mobile-label">Date</span>
                    <span className="operation-card-mobile-value">
                      {new Date(op.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {op.clientId && typeof op.clientId === 'object' && op.clientId.firstName && (
                  <div className="operation-card-mobile-footer">
                    <Link to={`/clients/${op.clientId._id || op.clientId}`} className="action-link">
                      Voir le Bénéficiaire →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Operations
