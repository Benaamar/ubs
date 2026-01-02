import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { 
  FiArrowLeft,
  FiLayers,
  FiSave,
  FiDollarSign,
  FiEye,
  FiEyeOff,
  FiLoader
} from 'react-icons/fi'
import './Accounts.css'

function Accounts() {
  const navigate = useNavigate()
  const [adminBalance, setAdminBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showBalances, setShowBalances] = useState({
    courant: false,
    'livret-a': false,
    epargne: false
  })

  // Définition des 3 comptes
  const accounts = [
    {
      id: 'courant',
      name: 'Compte Courant',
      iban: 'CH93 0076 2011 6238 5295 7',
      type: 'Compte de transaction',
      icon: FiLayers,
      color: '#3b82f6',
      description: 'Compte principal pour vos opérations quotidiennes'
    },
    {
      id: 'livret-a',
      name: 'Livret A',
      iban: 'CH55 0023 5235 8890 1234 5',
      type: 'Compte d\'épargne',
      icon: FiSave,
      color: '#10b981',
      description: 'Épargne sécurisée avec disponibilité immédiate'
    },
    {
      id: 'epargne',
      name: 'Compte Épargne',
      iban: 'CH81 0024 1016 3852 9450 1',
      type: 'Compte d\'épargne rémunéré',
      icon: 'CHF',
      color: '#f59e0b',
      description: 'Épargne rémunérée pour vos projets'
    }
  ]

  useEffect(() => {
    loadBalance()
  }, [])

  const loadBalance = async () => {
    try {
      const response = await api.get('/operations')
      if (response.data.success) {
        const operations = response.data.data || []
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
      console.error('Erreur lors du chargement du solde:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBalance = (accountId) => {
    setShowBalances(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }))
  }

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-CH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  if (loading) {
    return (
      <div className="accounts-container">
        <div className="loading-container">
          <FiLoader className="spinner-icon" size={48} />
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="accounts-container">
      <div className="accounts-header">
        <div className="page-header-with-back">
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
            aria-label="Retour"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1>Mes Comptes</h1>
        </div>
      </div>

      <div className="accounts-grid">
        {accounts.map((account) => {
          const Icon = account.icon
          const showBalance = showBalances[account.id]
          const isTextIcon = typeof Icon === 'string'

          return (
            <div key={account.id} className="account-card">
              <div className="account-card-header">
                <div className="account-icon" style={{ backgroundColor: `${account.color}20` }}>
                  {isTextIcon ? (
                    <span style={{ color: account.color, fontSize: '20px', fontWeight: 'bold' }}>
                      {Icon}
                    </span>
                  ) : (
                    <Icon size={28} style={{ color: account.color }} />
                  )}
                </div>
                <button 
                  className="eye-btn"
                  onClick={() => toggleBalance(account.id)}
                  aria-label={showBalance ? "Masquer le solde" : "Afficher le solde"}
                >
                  {showBalance ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <div className="account-card-body">
                <h2 className="account-name">{account.name}</h2>
                <p className="account-type">{account.type}</p>
                <p className="account-description">{account.description}</p>

                <div className="account-iban-box">
                  <label>IBAN</label>
                  <div className="account-iban">{account.iban}</div>
                </div>

                <div className="account-balance-box">
                  <label>Solde disponible</label>
                  <div className="account-balance" style={{ color: account.color }}>
                    {showBalance ? (
                      <>CHF {formatAmount(adminBalance)}</>
                    ) : (
                      '•••••••'
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Accounts

