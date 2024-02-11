const Recipe = require('../models/recipe.model');

const multer = require('multer');
const upload = multer({ dest: 'public/' });

exports.addRecipe = upload.single('image'), async (req, res) => {
  try {
    const { email, name, description, category } = req.body;
    const ingredients = JSON.parse(req.body.ingredients);

    const newRecipe = new Recipe({
      email,
      name,
      description,
      ingredients,
      category
    });

    if (req.file) {
      const filePath = req.file.path.replace(/\\+/g, '/');
      newRecipe.image = `http://localhost:8000/${filePath}`;
    }

    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully", newRecipe });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getAll = (req, res) => {
  Recipe.find()
    .then(recipes => res.json(recipes))
    .catch(err => res.status(400).json('Error: ' + err));
};

exports.getById = (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => res.json(recipe))
    .catch(err => res.status(400).json('Error: ' + err));
};

exports.deleteById = (req, res) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then(() => res.json('Recipe deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
};

exports.updateById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.name = req.body.name || recipe.name;
    recipe.description = req.body.description || recipe.description;
    recipe.ingredients = req.body.ingredients || recipe.ingredients;
    recipe.category = req.body.category || recipe.category;

    await recipe.save();
    res.status(200).json({ message: 'Recipe updated successfully', recipe });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { rating, userId } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (!recipe.ratings) {
      recipe.ratings = [];
    }

    const existingRatingIndex = recipe.ratings.findIndex(r => r.userId.toString() === userId);
    if (existingRatingIndex !== -1) {
      recipe.ratings[existingRatingIndex].rating = rating;
    } else {
      recipe.ratings.push({ userId, rating });
    }

    await recipe.save();
    res.status(200).json({ message: 'Rating added successfully', recipe });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const recipes = await Recipe.find({ category: category });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { userId, userName, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already left a review
    const alreadyReviewed = recipe.reviews.some(review => review.userId.toString() === userId);
    if (alreadyReviewed) {
      return res.status(400).json({ message: "User has already submitted a review" });
    }

    const newReview = { userId, userName, comment };
    recipe.reviews.push(newReview);

    await recipe.save();
    res.status(200).json({ message: 'Review added successfully', newReview });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReviewsByRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate('reviews.userId', 'username');

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe.reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};