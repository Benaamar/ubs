import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiArrowLeft, FiUser, FiRepeat, FiDollarSign, FiFileText, FiSave, FiX, FiLayers } from 'react-icons/fi'
import api from '../services/api'
import './AddOperation.css'

function AddOperation() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const clientIdParam = searchParams.get('clientId')

  const [clients, setClients] = useState([])
  const [adminAccount, setAdminAccount] = useState(null)
  const [adminBalance, setAdminBalance] = useState(0)
  const [formData, setFormData] = useState({
    clientId: clientIdParam || '',
    adminAccountId: '',
    amount: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadClients()
    loadAdminAccount()
  }, [])

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

  const loadAdminAccount = async () => {
    try {
      const [userResponse, operationsResponse] = await Promise.all([
        api.get('/auth/me'),
        api.get('/operations')
      ])
      
      if (userResponse.data.success) {
        setAdminAccount(userResponse.data.user)
        setFormData(prev => ({
          ...prev,
          adminAccountId: userResponse.data.user.id || ''
        }))
      }

      // Calculer le solde à partir des opérations
      if (operationsResponse.data.success) {
        const operations = operationsResponse.data.data || []
        let balance = 0
        operations.forEach(op => {
          if (op.status === 'completed') {
            if (op.type === 'deposit') {
              balance += op.amount
            } else {
              balance -= op.amount
            }
          }
        })
        setAdminBalance(balance)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du compte admin:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!formData.clientId) {
        setError('Veuillez sélectionner un bénéficiaire')
        setLoading(false)
        return
      }

      if (!formData.adminAccountId) {
        setError('Veuillez sélectionner le compte de l\'admin')
        setLoading(false)
        return
      }

      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        setError('Veuillez saisir un montant valide')
        setLoading(false)
        return
      }

      const payload = {
        clientId: formData.clientId,
        adminAccountId: formData.adminAccountId,
        type: 'transfer', // Par défaut, c'est un virement depuis le compte admin
        amount: amount,
        description: formData.description || ''
      }

      console.log('Payload envoyé:', payload) // Debug

      const response = await api.post('/operations', payload)
      if (response.data.success) {
        navigate('/operations')
      }
    } catch (error) {
      console.error('Erreur complète:', error.response?.data || error) // Debug
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de l\'opération'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-operation-container">
      <div className="add-operation-header">
        <button 
          onClick={() => navigate('/operations')} 
          className="back-button"
          aria-label="Retour"
        >
          <FiArrowLeft size={20} />
        </button>
        <div className="header-content">
          <h1>Nouvelle opération</h1>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-operation-form">
        {/* Informations de l'opération */}
        <div className="form-section">
          <div className="section-header">
            <div className="section-icon">
              <FiRepeat size={24} />
            </div>
            <h2>Informations de l'opération</h2>
          </div>
          
          <div className="form-group">
            <label htmlFor="clientId">
              <FiUser size={16} />
              Bénéficiaire <span className="required">*</span>
            </label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un bénéficiaire</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="adminAccountId">
              <FiLayers size={16} />
              Compte de l'admin <span className="required">*</span>
            </label>
            <select
              id="adminAccountId"
              name="adminAccountId"
              value={formData.adminAccountId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner le compte de l'admin</option>
              {adminAccount && (
                <option value={adminAccount.id}>
                  Mon Compte - Solde: {adminBalance.toLocaleString('fr-CH', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} CHF
                </option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              <FiDollarSign size={16} />
              Montant (CHF) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <FiFileText size={16} />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Description de l'opération (optionnel)"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/operations')}
            className="btn btn-primary"
          >
            <FiX size={18} />
            <span>Annuler</span>
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            <FiSave size={18} />
            <span>{loading ? 'Création en cours...' : 'Créer l\'opération'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddOperation

