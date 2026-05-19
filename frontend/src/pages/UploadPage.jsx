import React from 'react'
import FileUpload from '../components/FileUpload'

const UploadPage = ({ token, onUploadSuccess }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 1: Upload a Document</h2>
      <FileUpload token={token} onUploadSuccess={onUploadSuccess} />
    </div>
  )
}

export default UploadPage
