import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiFileText, FiSave, FiX } from 'react-icons/fi'
import api from '../services/api'
import './LoadBalance.css'

function LoadBalance() {
  const navigate = useNavigate()
  const [operationType, setOperationType] = useState('deposit')
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    clientId: '',
    recipientName: '',
    iban: '',
    reason: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (operationType === 'transfer') {
      loadClients()
    }
  }, [operationType])

  const loadClients = async () => {
    try {
      const response = await api.get('/clients')
      if (response.data.success) {
        const clientsData = response.data.data || []
        console.log('Clients loaded:', clientsData)
        setClients(clientsData)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')
    
    // Si un client est sélectionné, pré-remplir les champs du destinataire
    if (name === 'clientId' && value) {
      const selectedClient = clients.find(client => client._id === value)
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientId: value,
          recipientName: selectedClient.firstName && selectedClient.lastName 
            ? `${selectedClient.firstName} ${selectedClient.lastName}`
            : selectedClient.lastName || '',
          iban: selectedClient.accountNumber || ''
        }))
      }
    }
    
    // Si le champ clientId est vidé, vider aussi les champs pré-remplis
    if (name === 'clientId' && !value) {
      setFormData(prev => ({
        ...prev,
        clientId: '',
        recipientName: '',
        iban: ''
      }))
    }
  }

  const handleOperationTypeChange = (type) => {
    setOperationType(type)
    setError('')
    // Réinitialiser les champs spécifiques au transfert quand on change de type
    if (type === 'deposit') {
      setFormData({
        ...formData,
        clientId: '',
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
          reason: formData.reason || 'Rechargement de solde'
        }
      } else {
        // Validation spécifique au transfert
        if (!formData.clientId && !formData.recipientName.trim()) {
          setError('Veuillez sélectionner un client existant ou entrer le nom du destinataire')
          setLoading(false)
          return
        }
        if (!formData.clientId && !formData.iban.trim()) {
          setError('Veuillez entrer l\'IBAN du destinataire')
          setLoading(false)
          return
        }
        if (!formData.reason.trim()) {
          setError('Veuillez entrer le motif du transfert')
          setLoading(false)
          return
        }
        
        // Créer une opération de type 'deposit' même pour les transferts manuels
        payload = {
          type: 'deposit',
          amount: amount,
          description: formData.description || 'Transfert manuel',
          ...(formData.clientId && { clientId: formData.clientId }),
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
          <div className="section-header" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center' 
          }}>
            <div className="section-icon" style={{ 
              fontSize: '20px', 
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>CHF</div>
            <h2 style={{ margin: 0 }}>
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
              min="0"
              required
            />
            <span className="input-hint">Montant en CHF</span>
          </div>

          {/* Champs spécifiques au transfert */}
          {operationType === 'transfer' && (
            <>
              <div className="form-group">
                <label htmlFor="clientId">
                  Bénéficiaire (optionnel)
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner un client existant...</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.firstName && client.lastName 
                        ? `${client.firstName} ${client.lastName}`
                        : client.lastName || 'Client sans nom'
                      }
                    </option>
                  ))}
                </select>
                <span className="input-hint">Ou remplissez les champs ci-dessous pour un nouveau destinataire</span>
              </div>

              <div className="form-group">
                <label htmlFor="recipientName">
                  Nom du destinataire {!formData.clientId && <span className="required">*</span>}
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Entrez le nom du destinataire"
                  required={!formData.clientId}
                  disabled={!!formData.clientId}
                />
                {formData.clientId && (
                  <span className="input-hint">Pré-rempli depuis le client sélectionné</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="iban">
                  IBAN {!formData.clientId && <span className="required">*</span>}
                </label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                  value={formData.iban}
                  onChange={handleChange}
                  placeholder="CHXX XXXX XXXX XXXX XXXX X"
                  required={!formData.clientId}
                  disabled={!!formData.clientId}
                />
                {formData.clientId && (
                  <span className="input-hint">Pré-rempli depuis le client sélectionné</span>
                )}
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
                  required
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

