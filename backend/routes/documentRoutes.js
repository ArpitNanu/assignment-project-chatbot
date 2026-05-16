import express from "express";
import pdf from "pdf-parse";
import upload from "../middleware/uploadMiddleware.js";
import Document from "../models/Document.js";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdf(req.file.buffer);
      extractedText = data.text;
    } else if (req.file.mimetype === "text/plain") {
      extractedText = req.file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ message: "Unsupported file type. Please upload PDF or TXT." });
    }

    const newDoc = new Document({
      fileName: req.file.originalname,
      content: extractedText,
    });

    await newDoc.save();

    res.json({
      success: true,
      message: "File uploaded and text extracted successfully!",
      documentId: newDoc._id,
    });
  } catch (error) {
    console.error("Extraction Error:", error);
    res.status(500).json({ message: "Error processing document" });
  }
});

export default router;