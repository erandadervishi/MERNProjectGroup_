import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import Footer from './Footer';

const AddRecipeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: [''], // Array of strings
    category: '',
    image: null
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const categories = ['Appetizer', 'Salad', 'Pasta', 'Main Course', 'Dessert', 'Beverage',];

  const handleInputChange = (event) => {
    if (event.target.name === 'image') {
      setFormData({ ...formData, image: event.target.files[0] });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleIngredientChange = (index, event) => {
    let newIngredients = [...formData.ingredients];
    newIngredients[index] = event.target.value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleAddIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const handleImageChange = (event) => {
    setFormData({ ...formData, image: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    formData.ingredients.forEach(ingredient => {
      if (ingredient.trim() !== '') {
        data.append('ingredients', ingredient);
      }
    });
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image, formData.image.name);
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/recipes/add', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Recipe added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting recipe:', error.response);
      setMessage(error.response?.data?.msg || 'Failed to add recipe');
    }
  };

  return (
    <Container>
      <NavbarComponent />
      <Form onSubmit={handleSubmit} className='p-5 shadow-sm bg-white'>
        <Form.Group>
          <Form.Label>Recipe Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        {formData.ingredients.map((ingredient, index) => (
          <Form.Group key={index}>
            <Form.Label>Ingredient {index + 1}</Form.Label>
            <Form.Control
              type="text"
              value={ingredient}
              onChange={(event) => handleIngredientChange(index, event)}
              required
            />
          </Form.Group>
        ))}
        <Button variant="link" onClick={handleAddIngredient}>+ Add Ingredient</Button>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Recipe Image</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
          />
        </Form.Group>
        <Button className='mt-4' variant="primary" type="submit">Submit Recipe</Button>
      </Form>
      {message && <Alert variant="info">{message}</Alert>}
      <Footer/>
    </Container>
  );
};

export default AddRecipeForm;