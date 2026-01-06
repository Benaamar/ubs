import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './History.css'

const History = () => {
  const navigate = useNavigate()
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setLoading(true)
      const res = await api.get('/operations')
      if (res.data?.success) setOperations(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const groupByMonth = (ops) => {
    const groups = {}
    ops.forEach(op => {
      const d = new Date(op.createdAt)
      const key = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      if (!groups[key]) groups[key] = []
      groups[key].push(op)
    })
    return groups
  }

  const formatAmount = (amount) =>
    amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const grouped = groupByMonth(operations)

  return (
    <div className="history-screen">
      <header className="history-top">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft size={20} />
        </button>
        <h1>Transactions</h1>
      </header>

      <div className="search-section">
        <div className="search-wrapper">
          <FiSearch className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && <p className="loading">Chargement…</p>}

      {!loading && Object.entries(grouped).map(([month, ops]) => (
        <section key={month} className="month-block">
          <h2 className="month-title">{month}</h2>
          {ops.map(op => (
            <div key={op._id} className="transaction-row">
              <div className="tx-left">
                <div className="tx-title">{op.description || op.type}</div>
                <div className="tx-sub">
                  {formatDate(op.createdAt)} · {op.status}
                </div>
              </div>
              <div className={`tx-amount ${op.type === 'deposit' ? 'pos' : 'neg'}`}>
                GBP {op.type === 'deposit' ? '' : '-'}{formatAmount(op.amount)}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

export default History