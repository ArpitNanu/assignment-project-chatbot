import React from 'react'
import Signup from '../components/Signup'

const SignupPage = ({ onLoginSuccess }) => {
  return (
    <div className="mt-12">
      <Signup onLoginSuccess={onLoginSuccess} />
    </div>
  )
}

export default SignupPage
