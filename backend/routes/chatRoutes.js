import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.send("Chat Route");
});

export default router;