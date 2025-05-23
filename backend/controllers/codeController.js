
const axios = require('axios');
const Code = require('../models/Code');

const executeCode = async (req, res) => {
  const { language, version, code, input = "" } = req.body;

  console.log('Request received:', { language, version, code, input });

  if (!language || !version || !code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid language, version, or code',
    });
  }

  try {
    const fileExtension = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp',
      java: 'java',
      go: 'go',
      c: 'c',
      sqlite3: 'sql',
    }[language] || 'txt';

    const startTime = Date.now();

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language,
      version,
      stdin: input,
      files: [
        {
          name: `main.${fileExtension}`,
          content: code,
        },
      ],
    });

    const { stdout, stderr } = response.data.run;
    const output = stdout || stderr || 'No output received.';
    const executionTime = Date.now() - startTime;

    const savedCode = new Code({
      language,
      version,
      code,
      input,
      output,
      executionTime,
    });

    await savedCode.save();

    res.json({ success: true, output, executionTime });
  } catch (error) {
    console.error('Execution Error:', error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Code execution failed',
    });
  }
};

module.exports = { executeCode };
