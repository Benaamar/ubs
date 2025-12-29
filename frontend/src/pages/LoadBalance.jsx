import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiFileText, FiSave, FiX } from 'react-icons/fi'
import api from '../services/api'
import './LoadBalance.css'

function LoadBalance() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    amount: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      const amount = parseFloat(formData.amount)
      if (!amount || amount <= 0) {
        setError('Veuillez entrer un montant valide')
        setLoading(false)
        return
      }

      // Créer une opération de type 'deposit' pour le compte admin (sans clientId)
      const payload = {
        type: 'deposit',
        amount: amount,
        description: formData.description || 'Rechargement de solde'
        // Pas de clientId pour les dépôts admin
      }
      
      console.log('Payload envoyé pour chargement de solde:', payload)
      
      const response = await api.post('/operations', payload)

      if (response.data.success) {
        // Rediriger vers le dashboard avec un message de succès
        navigate('/', { state: { message: 'Solde chargé avec succès' } })
      }
    } catch (err) {
      console.error('Erreur lors du chargement du solde:', err)
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue lors du chargement du solde'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="load-balance-container">
      <div className="load-balance-header">
        <div className="page-header-with-back">
          <button
            onClick={() => navigate('/')}
            className="back-button"
            aria-label="Retour"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="header-content">
            <h1>Charger mon solde</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="load-balance-form">
        <div className="form-section">
          <div className="section-header">
            <div className="section-icon" style={{ fontSize: '20px', fontWeight: 'bold' }}>CHF</div>
            <h2>Informations de rechargement</h2>
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              Montant <span className="required">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
            <span className="input-hint">Montant en CHF</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du rechargement..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="btn btn-secondary"
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
            <span>{loading ? 'Chargement en cours...' : 'Charger le solde'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoadBalance

