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

// No dedicated "plus" icon exists in the image set — inline SVG instead,
// styled with currentColor so it inherits whatever color its container uses.
export const LoadFundsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
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

// Deposit (Load) = wallet icon, per user confirmation
export const DepositIcon = () => (
  <img src="/15.jpg" alt="Deposit" className="icon-md" />
)

// Withdraw (Trip fare) = bus icon, per user confirmation
export const WithdrawIcon = () => (
  <img src="/13.jpg" alt="Trip" className="icon-md" />
)

export const EditIcon = () => (
  <img src="/16.jpg" alt="Edit" className="icon-sm" />
)

export const NotificationIcon = () => (
  <img src="/16.jpg" alt="Notifications" className="icon-sm" />
)

export const WalletIcon = () => (
  <img src="/15.jpg" alt="Wallet" className="icon-md" />
)
