import React from 'react'
import Login from '../components/Login'

const LoginPage = ({ onLoginSuccess }) => {
  return (
    <div className="mt-12">
      <Login onLoginSuccess={onLoginSuccess} />
    </div>
  )
}

export default LoginPage
