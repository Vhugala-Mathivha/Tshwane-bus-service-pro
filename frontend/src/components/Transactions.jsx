import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, formatTransactionType, getTransactions, isAuthenticated } from '../services/api'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon, EditIcon, WithdrawIcon } from './Icons'

function Transactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/')
      return
    }

    const loadTransactions = async () => {
      try {
        setLoading(true)
        const response = await getTransactions()
        setTransactions(response.transactions || [])
        setError('')
      } catch (error) {
        console.error('Unable to load transactions:', error)
        setError('Unable to load transactions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [navigate])

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <Link to="/dashboard" className="dash-back-btn">← Back</Link>
        </div>

        <div className="transactions-header">
          <div className="transactions-title-row">
            <h1>Transaction History</h1>
          </div>
          <p className="transactions-month">This month</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-message">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions yet.</p>
            <p className="no-transactions-sub">Your transaction history will appear here after you make a payment or load funds.</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((txn) => (
            <div className="transaction-item" key={txn.id}>
              <div className="txn-left">
                <div className="txn-icon">{txn.type === 'Load' ? <EditIcon /> : <WithdrawIcon />}</div>
                <div className="txn-info">
                  <div className="txn-type">{formatTransactionType(txn.type)}</div>
                  <div className="txn-date">{formatDate(txn.transactionDate)}</div>
                </div>
              </div>
              <div className="txn-right">
                <div className={`txn-amount ${txn.type === 'Load' ? 'positive' : 'negative'}`}>
                  {`${txn.type === 'Load' ? '+' : '-'}R${Number(txn.amount).toFixed(2)}`}
                </div>
                <div className="txn-status">success</div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <Link to="/dashboard" className="nav-item">
          <span className="nav-icon"><HomeIcon /></span>
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/transactions" className="nav-item active">
          <span className="nav-icon"><TransactionsIcon active={true} /></span>
          <span className="nav-label">Transactions</span>
        </Link>
        <Link to="/tap-to-pay" className="nav-item">
          <span className="nav-icon"><TapToPayIcon /></span>
          <span className="nav-label">Tap to pay</span>
        </Link>
        <Link to="/card" className="nav-item">
          <span className="nav-icon"><CardIcon /></span>
          <span className="nav-label">Card</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <span className="nav-icon"><ProfileIcon /></span>
          <span className="nav-label">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default Transactions