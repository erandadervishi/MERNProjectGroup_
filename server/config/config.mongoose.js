const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/recipe_blog';
const connectDB = async () => {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB database connection established successfully');
};

module.exports = connectDB;