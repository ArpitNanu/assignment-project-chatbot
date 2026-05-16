import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Document from "../models/Document.js";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const prompt = `
      You are an assistant that answers questions based ONLY on the provided document content.
      If the answer is not in the document, say "I'm sorry, I couldn't find that information in the document."
      
      Document Content:
      ${document.content}
      
      User Question:
      ${question}
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
    res.status(500).json({ message: "Error communicating with AI" });
  }
});

export default router;