# AI Document Chat Assistant - Backend

This is the backend service for the AI Document Chat Assistant, built with Node.js, Express, MongoDB, and the Gemini API.

## Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root of the backend folder and add the following:
    ```env
    PORT=5001
    NODE_ENV=development
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

3.  **Run the Server:**
    ```bash
    # For development (with nodemon)
    npm run dev

    # For production
    npm start
    ```

## API Endpoints

### Authentication
*   `POST /api/auth/signup` - Register a new user.
*   `POST /api/auth/login` - Authenticate a user and get a JWT token.

### Documents (Protected)
*   `POST /api/documents/upload` - Upload a PDF/TXT file and extract text. Requires `multipart/form-data` with a `file` field.

### Chat (Protected)
*   `POST /api/chat` - Ask a question about an uploaded document (Requires `documentId` and `question` in JSON body).
*   `GET /api/chat/history` - Retrieve the user's past chat conversations.

## Architecture
See `BACKEND_EXPLANATION.md` for a detailed breakdown of the internal architecture and data flow.
