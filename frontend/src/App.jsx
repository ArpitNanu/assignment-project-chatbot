import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UploadPage from './pages/UploadPage'
import ChatPage from './pages/ChatPage'
import Header from './components/Header'

function App() {
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  
  // Document State
  const [uploadedDocumentId, setUploadedDocumentId] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState("")
  
  const navigate = useNavigate()

  const handleLoginSuccess = (receivedToken) => {
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    navigate('/upload');
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUploadedDocumentId(null);
    navigate('/login');
  }

  const handleUploadSuccess = (data, fileName) => {
    setUploadedDocumentId(data.documentId);
    setUploadedFileName(fileName);
    navigate('/chat');
  }

  const handleUploadDifferent = () => {
    setUploadedDocumentId(null);
    navigate('/upload');
  }

  // ProtectedRoute component inline
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans text-gray-800"> 
      {token && <Header onLogout={handleLogout} />} 

      <main>
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/upload" : "/login"} replace />} />
          
          <Route path="/login" element={
            token ? <Navigate to="/upload" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
          } />

          <Route path="/signup" element={
            token ? <Navigate to="/upload" replace /> : <SignupPage onLoginSuccess={handleLoginSuccess} />
          } />
          
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPage token={token} onUploadSuccess={handleUploadSuccess} />
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage 
                token={token} 
                uploadedDocumentId={uploadedDocumentId} 
                uploadedFileName={uploadedFileName} 
                onUploadDifferent={handleUploadDifferent} 
              />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}


export default App

