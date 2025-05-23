const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const generateFile = (language, code) => {
  const dirPath = path.join(__dirname, '..', 'temp');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const extensionMap = {
    'cpp': 'cpp',
    'c': 'c',
    'python': 'py',
    'javascript': 'js',
    'java': 'java'
  };

  const fileExtension = extensionMap[language];
  const filename = `${uuid()}.${fileExtension}`;
  const filepath = path.join(dirPath, filename);

  fs.writeFileSync(filepath, code);

  return filepath;
};

module.exports = { generateFile };
