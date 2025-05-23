const { exec } = require('child_process');
const path = require('path');

const runCode = (language, filepath, input) => {
  const timeoutMs = 5000; // 5 seconds timeout

  const commandMap = {
    'cpp': `g++ ${filepath} -o ${filepath}.out && ${filepath}.out`,
    'c': `gcc ${filepath} -o ${filepath}.out && ${filepath}.out`,
    'python': `python ${filepath}`,
    'javascript': `node ${filepath}`,
    'java': `javac ${filepath} && java ${path.basename(filepath, '.java')}`
  };

  const command = commandMap[language];

  return new Promise((resolve, reject) => {
    const process = exec(command, { timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
};

module.exports = { runCode };
