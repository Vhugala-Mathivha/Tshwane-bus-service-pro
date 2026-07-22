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