import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, formatTransactionType, getTransactions } from '../services/api'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon, DepositIcon, WithdrawIcon } from './Icons'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await getTransactions()
        setTransactions(response.transactions || [])
      } catch (error) {
        console.error('Unable to load transactions:', error)
      }
    }

    loadTransactions()
  }, [])

  // Limit to 5 transactions unless showAll is toggled to true
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5)

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <Link to="/dashboard" className="dash-back-btn">
            Back
          </Link>
        </div>

        <div className="transactions-header">
          <div className="transactions-title-row">
            <h1>Transaction History</h1>
          </div>
          <p className="transactions-month">This month</p>
        </div>

        <div className="transactions-list">
          {displayedTransactions.map((txn) => (
            <div className="transaction-item" key={txn.id}>
              <div className="txn-left">
                <div className="txn-icon">{txn.type === 'Load' ? <DepositIcon /> : <WithdrawIcon />}</div>
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

        {/* View More / Show Less Button placed at the bottom */}
        {transactions.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '16px' }}>
            <button
              type="button"
              className="view-more"
              onClick={() => setShowAll((prev) => !prev)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              {showAll ? 'Show Less ^' : 'View More >'}
            </button>
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