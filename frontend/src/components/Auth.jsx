import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only used for signup
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const url = isLogin 
      ? `${API_BASE_URL}/api/auth/login` 
      : `${API_BASE_URL}/api/auth/signup`;

    const bodyData = isLogin 
      ? { email, password } 
      : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Success! Pass token up to App.jsx
      onLoginSuccess(data.token);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border border-gray-300 rounded shadow-sm font-sans text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Login to AI Chatbot' : 'Create an Account'}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />

        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-2 bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="text-blue-600 font-semibold hover:underline"
        >
          {isLogin ? 'Sign up here' : 'Login here'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
