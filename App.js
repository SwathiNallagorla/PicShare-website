const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const indexRoutes = require('./routes/index');
const uploadRoutes = require('./routes/upload');

const app = express();

// MongoDB connection string
const mongoURI = 'mongodb+srv://test:test@cluster0.upmdo8b.mongodb.net/picshare?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Mongoose model
const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filename: String
});
const Photo = mongoose.model('Photo', photoSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Routes
app.use('/', indexRoutes(Photo));  // Pass the Photo model to the index routes
app.use('/upload', uploadRoutes(Photo, upload, body, validationResult));  // Pass dependencies to upload routes

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//mongoose.connect('mongodb+srv://test:test@cluster0.upmdo8b.mongodb.net/picshare?retryWrites=true&w=majority&appName=Cluster0')