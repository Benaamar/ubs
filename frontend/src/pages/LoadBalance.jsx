import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiFileText, FiSave, FiX } from 'react-icons/fi'
import api from '../services/api'
import './LoadBalance.css'

function LoadBalance() {
  const navigate = useNavigate()
  const [operationType, setOperationType] = useState('deposit')
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    recipientName: '',
    iban: '',
    reason: ''
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

  const handleOperationTypeChange = (type) => {
    setOperationType(type)
    setError('')
    // Réinitialiser les champs spécifiques au transfert quand on change de type
    if (type === 'deposit') {
      setFormData({
        ...formData,
        recipientName: '',
        iban: '',
        reason: ''
      })
    }
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

      let payload
      
      if (operationType === 'deposit') {
        // Créer une opération de type 'deposit' pour le compte admin (sans clientId)
        payload = {
          type: 'deposit',
          amount: amount,
          description: formData.description || 'Rechargement de solde'
        }
      } else {
        // Validation spécifique au transfert
        if (!formData.recipientName.trim()) {
          setError('Veuillez entrer le nom du destinataire')
          setLoading(false)
          return
        }
        if (!formData.iban.trim()) {
          setError('Veuillez entrer l\'IBAN du destinataire')
          setLoading(false)
          return
        }
        if (!formData.reason.trim()) {
          setError('Veuillez entrer le motif du transfert')
          setLoading(false)
          return
        }
        
        // Créer une opération de type 'transfer'
        payload = {
          type: 'transfer',
          amount: amount,
          description: formData.description || 'Transfert manuel',
          recipientName: formData.recipientName,
          iban: formData.iban,
          reason: formData.reason
        }
      }
      
      console.log('Payload envoyé pour chargement de solde:', payload)
      
      const response = await api.post('/operations', payload)

      if (response.data.success) {
        const successMessage = operationType === 'deposit' 
          ? 'Solde chargé avec succès' 
          : 'Transfert effectué avec succès'
        navigate('/', { state: { message: successMessage } })
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
            <h1>{operationType === 'deposit' ? 'Charger mon solde' : 'Effectuer un transfert'}</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="load-balance-form">
        {/* Sélecteur de type d'opération */}
        <div className="operation-type-selector">
          <h3>Type d'opération</h3>
          <div className="type-buttons">
            <button
              type="button"
              className={`type-btn ${operationType === 'deposit' ? 'active' : ''}`}
              onClick={() => handleOperationTypeChange('deposit')}
            >
              Charger le solde
            </button>
            <button
              type="button"
              className={`type-btn ${operationType === 'transfer' ? 'active' : ''}`}
              onClick={() => handleOperationTypeChange('transfer')}
            >
              Transfert manuel
            </button>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <div className="section-icon" style={{ fontSize: '20px', fontWeight: 'bold' }}>CHF</div>
            <h2>
              {operationType === 'deposit' 
                ? 'Informations de rechargement' 
                : 'Informations de transfert'}
            </h2>
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
              {operationType === 'deposit' ? 'Description (optionnel)' : 'Description (optionnel)'}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={operationType === 'deposit' ? 'Description du rechargement...' : 'Description du transfert...'}
              rows="3"
            />
          </div>

          {/* Champs spécifiques au transfert */}
          {operationType === 'transfer' && (
            <>
              <div className="form-group">
                <label htmlFor="recipientName">
                  Nom du destinataire <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Entrez le nom du destinataire"
                  required={operationType === 'transfer'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="iban">
                  IBAN <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                  value={formData.iban}
                  onChange={handleChange}
                  placeholder="CHXX XXXX XXXX XXXX XXXX X"
                  required={operationType === 'transfer'}
                />
                <span className="input-hint">Format IBAN suisse</span>
              </div>

              <div className="form-group">
                <label htmlFor="reason">
                  Motif du transfert <span className="required">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Décrivez le motif du transfert..."
                  rows="3"
                  required={operationType === 'transfer'}
                />
              </div>
            </>
          )}
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
            <span>
              {loading 
                ? (operationType === 'deposit' ? 'Chargement en cours...' : 'Transfert en cours...')
                : (operationType === 'deposit' ? 'Charger le solde' : 'Effectuer le transfert')
              }
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoadBalance

