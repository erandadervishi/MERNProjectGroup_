// EditRecipe.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import NavbarComponent from './NavbarComponent';
import Footer from './Footer';

const EditRecipe = () => {
    const [recipeData, setRecipeData] = useState({
        name: '',
        description: '',
        ingredients: [''],
        category: ''
    });
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const categories = ['Appetizer', 'Salad', 'Pasta', 'Main Course', 'Dessert', 'Beverage',];
    
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/recipes/${id}`);
                setRecipeData({ ...response.data, ingredients: response.data.ingredients.join(', ') });
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleChange = (event) => {
        setRecipeData({ ...recipeData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedData = {
            ...recipeData,
            ingredients: recipeData.ingredients.split(',').map(ingredient => ingredient.trim())
        };

        try {
            await axios.put(`http://localhost:8000/api/recipes/update/${id}`, updatedData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setMessage('Recipe updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating recipe:', error);
            setMessage('Failed to update recipe');
        }
    };

    return (
        <Container>
            <NavbarComponent />
            <h2 className="mt-5 mb-4">Edit Recipe</h2>
            <Form onSubmit={handleSubmit} className='p-5 shadow-sm bg-white'>
                <FormGroup className="mb-3">
                    <FormLabel>Name</FormLabel>
                    <FormControl 
                        type="text" 
                        name="name" 
                        value={recipeData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormLabel>Description</FormLabel>
                    <FormControl 
                        as="textarea" 
                        name="description" 
                        value={recipeData.description} 
                        onChange={handleChange} 
                        required 
                    />
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl 
                        type="text" 
                        name="ingredients" 
                        value={recipeData.ingredients} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter ingredients separated by commas" 
                    />
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormLabel>Category</FormLabel>
                    <FormControl 
                        as="select" 
                        name="category" 
                        value={recipeData.category} 
                        onChange={handleChange} 
                        required 
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </FormControl>
                </FormGroup>
                <Button variant="primary" type="submit">Update Recipe</Button>
                {message && <Alert variant="info" className="mt-3">{message}</Alert>}
            </Form>
            <Footer/>
        </Container>
    );
};

export default EditRecipe;
