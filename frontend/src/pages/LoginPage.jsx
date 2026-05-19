import React from 'react'
import Auth from '../components/Auth'

const LoginPage = ({ onLoginSuccess }) => {
  return (
    <div className="mt-12">
      <Auth onLoginSuccess={onLoginSuccess} />
    </div>
  )
}

export default LoginPage
