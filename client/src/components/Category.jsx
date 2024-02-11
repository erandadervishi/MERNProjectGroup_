import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import moment from 'moment';
import Footer from './Footer';

const Category = () => {
  const [recipes, setRecipes] = useState([]);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipesByCategory();
  }, [category]);

  const fetchRecipesByCategory = async () => {
    try {
      const result = await axios.get(`http://localhost:8000/api/recipes/category/${category}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setRecipes(result.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 'No ratings';
    const total = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/recipes/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchRecipesByCategory(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <Container>
      <NavbarComponent />
      <h3 className="mt-5 mb-3">{category} Recipes</h3>
      <div class="title-shape mb-4"></div>
      <Row>
        {recipes.map((recipe, index) => (
          <Col key={index} md={3} className="mb-4">
            <Card>
              <Link to={`/recipe/${recipe._id}`}>
                <div className="image-container">
                  <Card.Img variant="top" src={recipe.image} />
                </div>
              </Link>
              <Card.Body>
                <Card.Title>
                  <Link to={`/recipe/${recipe._id}`}>{recipe.name}</Link>
                </Card.Title>
                <Card.Text>
                  <Badge bg="secondary">{calculateAverageRating(recipe.ratings)} Stars</Badge>
                  <br />
                  Posted {moment(recipe.createdAt).fromNow()}
                </Card.Text>
                <Button variant="warning" onClick={() => navigate(`/edit/${recipe._id}`)}>Edit</Button>
                <Button variant="danger" className="ms-2" onClick={() => deleteRecipe(recipe._id)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Footer/>
    </Container>
  );
};

export default Category;
