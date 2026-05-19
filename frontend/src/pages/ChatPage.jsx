import React from 'react'
import { Navigate } from 'react-router-dom'
import ChatBox from '../components/ChatBox'

const ChatPage = ({ token, uploadedDocumentId, uploadedFileName, onUploadDifferent }) => {
  if (!uploadedDocumentId) {
    return <Navigate to="/upload" replace />
  }

  return (
    <div>
      <div className="p-4 bg-green-100 text-green-800 rounded mb-6 flex justify-between items-center">
        <div>
          <strong className="block">Document Uploaded!</strong>
          <span>{uploadedFileName}</span>
        </div>
        <button 
          onClick={onUploadDifferent}
          className="text-sm bg-white px-3 py-1 rounded shadow-sm hover:bg-gray-50 font-medium"
        >
          Upload Different
        </button>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Step 2: Ask Questions</h2>
      <ChatBox token={token} documentId={uploadedDocumentId} />
    </div>
  )
}

export default ChatPage
