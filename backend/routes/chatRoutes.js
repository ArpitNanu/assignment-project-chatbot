import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Document from "../models/Document.js";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" }, { apiVersion: "v1" });

// @desc    Get chat history for the logged in user
// @route   GET /api/chat/history
router.get("/history", protect, async (req, res) => {
  try {
    const history = await Chat.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// @desc    Ask a question and save to history
// @route   POST /api/chat
router.post("/", protect, async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ message: "Document ID and Question are required." });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    console.log(`Sending prompt to AI for document: ${document.fileName} (Content length: ${document.content?.length || 0})`);

    const prompt = `
      You are a professional Document Assistant. Your task is to help the user understand the content of the provided document.
      
      CONTEXT:
      - Document Title: ${document.fileName}
      - Document Type: ${document.fileType}
      
      DOCUMENT CONTENT:
      ---
      ${document.content}
      ---
      
      USER QUESTION:
      ${question}
      
      INSTRUCTIONS:
      1. Answer the question thoroughly based on the DOCUMENT CONTENT provided above.
      2. If the answer is partially available, provide the available details.
      3. If the answer is absolutely not in the document, politely say: "I'm sorry, I couldn't find that specific information in the document, but I can help you with other parts of it."
      4. Maintain a helpful and professional tone.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    // Save to History
    const chat = new Chat({
      userId: req.user._id,
      question,
      answer,
    });
    await chat.save();

    res.json({
      success: true,
      answer: answer,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ 
      message: "Error communicating with AI",
      error: error.message 
    });
  }
});

export default router;