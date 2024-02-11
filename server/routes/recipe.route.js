const express = require('express');
const recipeController = require('../controllers/recipe.controller');

const router = express.Router();

// router.post('/add', recipeController.addRecipe);

router.get('/', recipeController.getAll);
router.get('/:id', recipeController.getById);
router.delete('/:id', recipeController.deleteById);
router.put('/update/:id', recipeController.updateById);
router.post('/:id/rate', recipeController.addRating);
router.get('/category/:category', recipeController.getByCategory);
router.post('/:id/review', recipeController.addReview);
router.get('/:id/reviews', recipeController.getReviewsByRecipe);

module.exports = router;