import React from 'react'

export const HomeIcon = ({ active }) => (
  <img src="/1.jpg" alt="Home" className={`nav-icon-img ${active ? 'active' : ''}`} />
)

export const TransactionsIcon = ({ active }) => (
  <img src="/2.jpg" alt="Transactions" className={`nav-icon-img ${active ? 'active' : ''}`} />
)

export const TapToPayIcon = ({ active }) => (
  <img src="/3.jpg" alt="Tap to Pay" className={`nav-icon-img ${active ? 'active' : ''}`} />
)

export const CardIcon = ({ active }) => (
  <img src="/4.jpg" alt="Card" className={`nav-icon-img ${active ? 'active' : ''}`} />
)

export const ProfileIcon = ({ active }) => (
  <img src="/5.jpg" alt="Profile" className={`nav-icon-img ${active ? 'active' : ''}`} />
)

export const BackIcon = () => (
  <img src="/6.jpg" alt="Back" className="icon-sm" />
)

export const LogoutIcon = () => (
  <img src="/7.jpg" alt="Logout" className="icon-sm" />
)

export const LoadFundsIcon = () => (
  <img src="/8.jpg" alt="Load Funds" className="icon-md" />
)

export const CheckIcon = () => (
  <img src="/7.jpg" alt="Success" className="icon-lg" />
)

export const VisaIcon = () => (
  <img src="/10.jpg" alt="Visa" className="icon-payment" />
)

export const MastercardIcon = () => (
  <img src="/11.jpg" alt="Mastercard" className="icon-payment" />
)

export const BusIcon = () => (
  <img src="/12.jpg" alt="Bus" className="icon-md" />
)

export const DepositIcon = () => (
  <img src="/13.jpg" alt="Deposit" className="icon-md" />
)

export const WithdrawIcon = () => (
  <img src="/14.jpg" alt="Withdraw" className="icon-md" />
)

export const EditIcon = () => (
  <img src="/15.jpg" alt="Edit" className="icon-sm" />
)

export const NotificationIcon = () => (
  <img src="/16.jpg" alt="Notifications" className="icon-sm" />
)

export const WalletIcon = () => (
  <img src="/17.jpg" alt="Wallet" className="icon-md" />
)

export const FindStationsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
    <path d="M11 8v6"/>
    <path d="M8 11h6"/>
  </svg>
)

export const BusTimetableIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
    <polyline points="14,13 16,15 20,11"/>
  </svg>
)
