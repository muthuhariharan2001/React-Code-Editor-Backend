// server/routes/codeExecutionRoute.js
const express = require('express');
const router = express.Router();
const { runCode } = require('../services/codeRunner');

router.post('/execute', async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({ success: false, message: "Language and code are required." });
    }

    const output = await runCode(language, code);

    res.json({ success: true, output });
  } catch (error) {
    res.json({ success: false, error });
  }
});

module.exports = router;
