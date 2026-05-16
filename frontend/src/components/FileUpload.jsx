import React, { useState } from 'react';

const FileUpload = ({ token, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Changed endpoint to /api/documents/upload to match backend
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          // Add JWT Authorization header
          'Authorization': `Bearer ${token}`
          // Do NOT set Content-Type for FormData, the browser handles it
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status: ${response.status}`);
      }

      const fileName = selectedFile.name;
      setSelectedFile(null);
      
      if (onUploadSuccess) {
        // Pass the data object (which has documentId) and the fileName
        onUploadSuccess(data, fileName);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.message || "Something went wrong during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border border-gray-300 p-6 rounded max-w-md mx-auto bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Upload a Document</h3>
      
      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <input 
            type="file" 
            onChange={handleFileChange} 
            disabled={isUploading}
            accept=".pdf,.txt,.md"
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <p className="text-sm text-gray-600 mb-4">
            Selected: <span className="font-semibold">{selectedFile.name}</span>
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>
        )}

        <button 
          type="submit" 
          disabled={!selectedFile || isUploading}
          className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${
            !selectedFile || isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
