const Chat = require('../models/Chat');

// @desc    Start a new chat or continue existing
// @route   POST /api/chats
const createChatMessage = async (req, res) => {
  try {
    const { documentId, message, role } = req.body;

    let chat = await Chat.findOne({ documentId });

    if (!chat) {
      chat = await Chat.create({
        documentId,
        messages: [{ role, content: message }],
      });
    } else {
      chat.messages.push({ role, content: message });
      await chat.save();
    }

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    res.status(400);
    throw new Error('Error processing chat message');
  }
};

// @desc    Get chat history for a document
// @route   GET /api/chats/:documentId
const getChatHistory = async (req, res) => {
  const chat = await Chat.findOne({ documentId: req.params.documentId });

  if (chat) {
    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } else {
    res.status(404);
    throw new Error('Chat history not found');
  }
};

module.exports = {
  createChatMessage,
  getChatHistory,
};
