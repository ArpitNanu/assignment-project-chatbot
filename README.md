# AI-Native Full-Stack Chatbot

A full-stack application that allows users to securely upload PDF documents and have intelligent, context-aware conversations about them using Google's Gemini AI.

---

## 🌊 How the Code Flows (Architecture)

The application follows a clean separation of concerns between the React frontend and the Express backend:

1. **Authentication:** 
   - A user signs up or logs in via `Auth.jsx`. 
   - The backend (`authRoutes.js`) verifies credentials against MongoDB (`User.js`) and returns a secure JWT (JSON Web Token).
2. **Document Processing:** 
   - The user uploads a PDF via `FileUpload.jsx`. 
   - The backend catches it using `multer` middleware. 
   - The `documentRoutes.js` takes the raw file buffer, feeds it into the `pdf-parse` (v2) library to extract the text, and saves that text into the database (`Document.js`).
3. **AI Chat Engine:** 
   - The user types a question in `ChatBox.jsx`. 
   - The backend (`chatRoutes.js`) retrieves the extracted document text, combines it with the user's question, and sends a highly structured "Hybrid Prompt" to **Gemini 3.1 Flash Lite**. 
   - The AI responds, the answer is saved to MongoDB (`Chat.js`), and it is displayed to the user.

---

## 📁 Simplified Folder Structure

```text
assignment-project-chatbot/
│
├── frontend/                     # React UI (Vite + Tailwind CSS)
│   ├── src/components/           
│   │   ├── Auth.jsx              # Handles Login/Signup
│   │   ├── FileUpload.jsx        # Handles PDF uploads to the backend
│   │   └── ChatBox.jsx           # The chat interface with the AI
│   └── src/App.jsx               # Main state orchestrator
│
└── backend/                      # Node.js API (Express + MongoDB)
    ├── routes/                   
    │   ├── authRoutes.js         # JWT Authentication APIs
    │   ├── documentRoutes.js     # PDF Upload and Text Extraction logic
    │   └── chatRoutes.js         # Gemini AI Prompting and Response logic
    ├── models/                   # Mongoose Database Schemas
    │   ├── User.js               
    │   ├── Document.js           
    │   └── Chat.js               
    ├── middleware/               # Security and Upload interceptors
    └── server.js                 # The main backend entry point
```

---

## 🎤 Interview Preparation (Q&A)

Here are the top 3 questions an interviewer might ask about this specific project architecture, along with how to answer them:

### Q1: "How does your frontend communicate with the Gemini AI?"
**Answer:** "The frontend doesn't talk to Gemini directly for security reasons. Instead, React (`ChatBox.jsx`) sends the user's question and the `documentId` to my Express backend. The backend retrieves the extracted text for that document from MongoDB, builds a secure prompt using the `@google/generative-ai` SDK, and makes the API call to Gemini. Once the backend gets the response, it saves the chat history to the database and forwards the answer back to the React UI."

### Q2: "How did you handle PDF parsing in your Node.js environment?"
**Answer:** "I used `multer` to intercept the file upload in memory (as a Buffer). Then, I passed that Buffer into the `pdf-parse` library to extract the raw text. Interestingly, because I was using modern ES Modules (`import/export`) and `pdf-parse` v2 uses a Class-based architecture, I had to instantiate the `PDFParse` class with the buffer data, asynchronously extract the text using `.getText()`, and immediately call `.destroy()` on the instance to prevent memory leaks on the server."

### Q3: "How is user authentication managed across the application?"
**Answer:** "I implemented a JWT (JSON Web Token) strategy. When a user logs in, the Node backend hashes their password with `bcryptjs`, verifies it, and signs a JWT containing their User ID. The frontend stores this token (e.g., in localStorage). For every subsequent request—like uploading a file or sending a chat message—the frontend attaches the JWT in the Authorization header. My backend has an `authMiddleware` that intercepts these requests, verifies the token's signature, and attaches the user object to the request so the routes know exactly who is interacting with the system."
