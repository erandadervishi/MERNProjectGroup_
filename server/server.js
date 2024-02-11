const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const userRoutes = require('./routes/user.route');
const recipeRoutes = require('./routes/recipe.route');
const Recipe = require('./models/recipe.model');
const connectDB = require('./config/config.mongoose');
require('dotenv').config();

// Multer setup
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Serve static files from 'public' directory
app.use('/public', express.static('public'));

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

app.post('/api/recipes/add', upload.single('image'), async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    if (req.file) {
      // Update the image path for web access
      const filePath = req.file.path.replace(/\\/g, '/').replace('public/', '');
      recipe.image = `http://localhost:${port}/public/${filePath}`;
    }
    await recipe.save();
    res.status(200).send('Recipe added successfully!');
  } catch (error) {
    console.error('Error submitting recipe:', error);
    res.status(400).send(error.message);
  }
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});