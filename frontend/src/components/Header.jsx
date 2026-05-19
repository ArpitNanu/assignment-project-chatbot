import React from 'react'

const Header = ({ onLogout }) => {
  return (
    <header className="mb-8 flex justify-between items-center border-b pb-4">
      <div>
        <h1 className="text-3xl font-bold">AI Document Chatbot</h1>
        <p className="text-gray-500">Secure full-stack implementation</p>
      </div>
      <button 
        onClick={onLogout}
        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-semibold"
      >
        Logout
      </button>
    </header>
  )
}

export default Header
