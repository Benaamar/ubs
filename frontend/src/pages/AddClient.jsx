import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiX } from 'react-icons/fi'
import api from '../services/api'
import './AddClient.css'

function AddClient() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/clients', formData)
      if (response.data.success) {
        navigate('/clients')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création du client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-client-container">
      <div className="add-client-header">
        <button 
          onClick={() => navigate('/clients')} 
          className="back-button"
          aria-label="Retour"
        >
          <FiArrowLeft size={20} />
        </button>
        <div className="header-content">
          <h1>Ajouter un bénéficiaire</h1>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-client-form">
        {/* Informations personnelles */}
        <div className="form-section">
          <div className="section-header">
            <div className="section-icon">
              <FiUser size={24} />
            </div>
            <h2>Informations personnelles</h2>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">
                Prénom <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Entrez le prénom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Nom <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Entrez le nom"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FiMail size={16} />
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FiPhone size={16} />
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+41 XX XXX XX XX"
            />
          </div>
        </div>

        {/* Adresse */}
        <div className="form-section">
          <div className="section-header">
            <div className="section-icon">
              <FiMapPin size={24} />
            </div>
            <h2>Adresse</h2>
          </div>

          <div className="form-group">
            <label htmlFor="street">Rue</label>
            <input
              type="text"
              id="street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Nom de la rue et numéro"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Ville"
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Code postal</label>
              <input
                type="text"
                id="postalCode"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                placeholder="XXXX"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Pays</label>
            <input
              type="text"
              id="country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              placeholder="Pays"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/clients')}
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
            <span>{loading ? 'Création en cours...' : 'Créer le bénéficiaire'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClient

