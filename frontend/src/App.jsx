import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from './config'
import FileUpload from './components/FileUpload'
import ChatBox from './components/ChatBox'
import Auth from './components/Auth'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  
  // Document State
  const [uploadedDocumentId, setUploadedDocumentId] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState("")
  
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Backend not reachable:', err)
        setLoading(false)
      })
  }, [])

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

  // ProtectedRoute component inline
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans text-gray-800">
      {token && (
        <header className="mb-8 flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold">AI Document Chatbot</h1>
            <p className="text-gray-500">Secure full-stack implementation</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-semibold"
          >
            Logout
          </button>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/upload" : "/login"} replace />} />
          
          <Route path="/login" element={
            token ? <Navigate to="/upload" replace /> : <Auth onLoginSuccess={handleLoginSuccess} />
          } />
          
          <Route path="/upload" element={
            <ProtectedRoute>
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 1: Upload a Document</h2>
                <FileUpload token={token} onUploadSuccess={handleUploadSuccess} />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              {uploadedDocumentId ? (
                <div>
                  <div className="p-4 bg-green-100 text-green-800 rounded mb-6 flex justify-between items-center">
                    <div>
                      <strong className="block">Document Uploaded!</strong>
                      <span>{uploadedFileName}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setUploadedDocumentId(null);
                        navigate('/upload');
                      }}
                      className="text-sm bg-white px-3 py-1 rounded shadow-sm hover:bg-gray-50 font-medium"
                    >
                      Upload Different
                    </button>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4">Step 2: Ask Questions</h2>
                  <ChatBox token={token} documentId={uploadedDocumentId} />
                </div>
              ) : (
                <Navigate to="/upload" replace />
              )}
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
