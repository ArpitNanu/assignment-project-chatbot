import { useState, useEffect } from 'react'
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
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUploadedDocumentId(null);
  }

  const handleUploadSuccess = (data, fileName) => {
    setUploadedDocumentId(data.documentId);
    setUploadedFileName(fileName);
  }

  // If no token, show ONLY the Login/Signup screen
  if (!token) {
    return <Auth onLoginSuccess={handleLoginSuccess} />
  }

  // If we have a token, show the main app
  return (
    <div className="max-w-3xl mx-auto p-4 font-sans text-gray-800">
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

      <main>
        {!uploadedDocumentId ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 1: Upload a Document</h2>
            {/* We pass the token so FileUpload can send it to the backend */}
            <FileUpload token={token} onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div>
            <div className="p-4 bg-green-100 text-green-800 rounded mb-6 flex justify-between items-center">
              <div>
                <strong className="block">Document Uploaded!</strong>
                <span>{uploadedFileName}</span>
              </div>
              <button 
                onClick={() => setUploadedDocumentId(null)}
                className="text-sm bg-white px-3 py-1 rounded shadow-sm hover:bg-gray-50 font-medium"
              >
                Upload Different
              </button>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Step 2: Ask Questions</h2>
            {/* We pass both the document ID and token to the ChatBox */}
            <ChatBox token={token} documentId={uploadedDocumentId} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
