// History.jsx – Version finale 100% conforme capture (filtres fonctionnels + dates dynamiques + animation + responsive)

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './History.css'
import api from '../services/api'

const TABS = {
  LAST_30_DAYS: 'LAST_30_DAYS',
  LAST_20: 'LAST_20',
  LAST_6_MONTHS: 'LAST_6_MONTHS',
  AVENIR: 'AVENIR'
}

const History = () => {
  const navigate = useNavigate()
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(TABS.LAST_20)

  useEffect(() => {
    fetchOperations()
  }, [])

  const fetchOperations = async () => {
    try {
      setLoading(true)
      const res = await api.get('/operations')
      if (res.data?.success) setOperations(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const filteredOperations = useMemo(() => {
    const now = new Date()
    let filtered = [...operations]

    if (activeTab === TABS.LAST_30_DAYS) {
      const d = new Date()
      d.setDate(d.getDate() - 30)
      filtered = filtered.filter(op => new Date(op.createdAt) >= d)
    }

    if (activeTab === TABS.LAST_6_MONTHS) {
      const d = new Date()
      d.setMonth(d.getMonth() - 6)
      filtered = filtered.filter(op => new Date(op.createdAt) >= d)
    }

    if (activeTab === TABS.LAST_20) {
      filtered = filtered.slice(0, 20)
    }

    if (activeTab === TABS.AVENIR) {
      filtered = filtered.filter(op => op.isScheduled === true)
    }

    return filtered
  }, [operations, activeTab])

  const groupedByYear = useMemo(() => {
    const groups = {}
    filteredOperations.forEach(op => {
      const y = new Date(op.createdAt).getFullYear()
      if (!groups[y]) groups[y] = []
      groups[y].push(op)
    })
    return groups
  }, [filteredOperations])

  const formatAmount = (a) => a.toLocaleString('en-GB', { minimumFractionDigits: 2 })
  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB')

  const lastDate = filteredOperations[0]?.createdAt

  return (
    <div className="history-screen">
      <header className="history-top">
        <button className="bac" onClick={() => navigate(-1)}>←</button>
        <h1>Transactions</h1>
      </header>

      <div className="filter-bar">
        <div className="filter-label">Filter transactions ▾</div>
        <div className="filter-tabs">
          <button className={`tab ${activeTab === TABS.LAST_30_DAYS ? 'active' : ''}`} onClick={() => setActiveTab(TABS.LAST_30_DAYS)}>Last 30 Days</button>
          <button className={`tab ${activeTab === TABS.LAST_20 ? 'active' : ''}`} onClick={() => setActiveTab(TABS.LAST_20)}>Last 20 Transactions</button>
          <button className={`tab ${activeTab === TABS.LAST_6_MONTHS ? 'active' : ''}`} onClick={() => setActiveTab(TABS.LAST_6_MONTHS)}>Last 6 Months</button>
          <button className={`tab ${activeTab === TABS.AVENIR ? 'active' : ''}`} onClick={() => setActiveTab(TABS.AVENIR)}>À venir</button>
        </div>
        {lastDate && (
          <div className="filter-info">Until {formatDate(lastDate)} ({filteredOperations.length} transactions)</div>
        )}
      </div>

      {loading && <div className="loading">Loading…</div>}

      {!loading && Object.entries(groupedByYear)
        .sort((a, b) => b[0] - a[0])
        .map(([year, ops]) => (
          <section key={year}>
            <div className="year-label">{year}</div>
            {ops.map(op => (
              <div key={op._id} className="transaction-row">
                <div>
                  <div className="tx-title">
                    {op.clientId && typeof op.clientId === 'object' 
                      ? `${op.clientId.firstName || ''} ${op.clientId.lastName || ''}`.trim() || op.description || op.type
                      : op.description || op.type
                    }
                  </div>
                  <div className="tx-sub">{formatDate(op.createdAt)} {op.type.toUpperCase()}</div>
                </div>
                <div className="tx-amount">
                <span className={op.type === 'transfer' ? 'amount-negative' : op.type === 'deposit' ? 'amount-positive' : ''}>
                  CHF {op.type === 'deposit' ? '+' : op.type === 'transfer' ? '-' : ''}{formatAmount(op.amount)}
                </span>
              </div>
              </div>
            ))}
          </section>
        ))}
    </div>
  )
}

export default History
