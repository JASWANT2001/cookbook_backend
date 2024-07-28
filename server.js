const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Create an endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error uploading file',
      error: error.message,
    });
  }
});

// Create an endpoint to get the list of uploaded files
app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        message: 'Unable to scan files',
        error: err.message,
      });
    }
    res.status(200).json({
      message: 'Files retrieved successfully',
      files: files.map(file => ({
        name: file,
        url: `http://localhost:${port}/uploads/${file}`,
      })),
    });
  });
});

// Serve the uploads directory to view uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
