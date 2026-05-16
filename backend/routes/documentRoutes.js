import express from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import upload from "../middleware/uploadMiddleware.js";
import Document from "../models/Document.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("File received:", req.file.originalname, "Size:", req.file.size, "Mime:", req.file.mimetype);

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      console.log("Starting PDF extraction...");
      
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      extractedText = result.text || "";
      await parser.destroy();
      
      console.log("Extraction successful, text length:", extractedText.length);
    } else if (req.file.mimetype === "text/plain") {
      extractedText = req.file.buffer.toString("utf-8");
    } else {
      console.log("Unsupported type:", req.file.mimetype);
      return res.status(400).json({ message: "Unsupported file type. Please upload PDF or TXT." });
    }

    const newDoc = new Document({
      userId: req.user._id,
      fileName: req.file.originalname,
      content: extractedText,
    });

    await newDoc.save();
    console.log("Document saved to DB");

    res.json({
      success: true,
      message: "File uploaded and text extracted successfully!",
      documentId: newDoc._id,
    });
  } catch (error) {
    console.error("DETAILED EXTRACTION ERROR:", error);
    res.status(500).json({ 
      message: "Error processing document", 
      details: error.message // Sending details back to help debugging
    });
  }
});

export default router;