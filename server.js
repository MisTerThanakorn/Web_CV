const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/colorize', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const inputPath = path.resolve(req.file.path);
  const outputPath = inputPath + '_colored.jpg';

  // Spawn Python script
  const py = spawn('python3', ['colorize.py', inputPath, outputPath]);
  let errData = '';
  py.stderr.on('data', data => { errData += data.toString(); });

  py.on('close', code => {
    if (code !== 0) {
      console.error('Python error:', errData);
      return res.status(500).json({ error: 'Colorization failed' });
    }
    // Send file and cleanup
    res.sendFile(outputPath, err => {
      // remove temp files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
      if (err) console.error('Send file error:', err);
    });
  });
});

app.listen(3000, () => {
  console.log('Express server listening on http://localhost:3000');
});