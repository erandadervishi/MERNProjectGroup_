import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Carousel } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import moment from 'moment';
import Footer from './Footer';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const sectionBelowRef = useRef(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const result = await axios.get('http://localhost:8000/api/recipes', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setRecipes(result.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const groupRecipesByCategory = () => {
    return recipes.reduce((acc, recipe) => {
      if (!acc[recipe.category]) {
        acc[recipe.category] = [];
      }
      acc[recipe.category].push(recipe);
      return acc;
    }, {});
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
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const groupedRecipes = groupRecipesByCategory();

  const scrollToSectionBelow = () => {
    sectionBelowRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container fluid>
      <NavbarComponent />
      <Carousel interval={3000} className="mb-4 slider-carousel">
          <Carousel.Item style={{ height: '650px', backgroundImage: "url(https://dahz-theme.com/foodandcook/wp-content/uploads/2015/02/straw.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="carousel-center">
                  <div className="text-center text-white">
                      <h1 className='txt_shadow'>Discover Amazing Recipes</h1>
                      <p className='txt_shadow_sm'>Explore a wide range of recipes from around the world and find your favorites.</p>
                      <Button className='mt-3' variant="primary" onClick={scrollToSectionBelow}>Explore</Button>
                  </div>
              </div>
          </Carousel.Item>
          <Carousel.Item style={{ height: '650px', backgroundImage: "url(http://www.themeenergy.com/themes/wordpress/social-chef/wp-content/uploads/2014/12/intro.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="carousel-center">
                  <div className="text-center text-white">
                      <h1 className='txt_shadow'>Share Your Recipes</h1>
                      <p className='txt_shadow_sm'>Have a delicious recipe to share? Post it on our platform and let others enjoy it too!</p>
                      <Button className='mt-3' variant="primary" onClick={() => navigate('/add-recipe')}>Share Now</Button>
                  </div>
              </div>
          </Carousel.Item>
      </Carousel>
      <Container className="mt-4" ref={sectionBelowRef} id='sectionBelow'>
      {Object.keys(groupedRecipes).map(category => (
        <div key={category}>
          <h3 className="mt-4 mb-3">{category}</h3>
          <div class="title-shape mb-4"></div>
          <Row>
            {groupedRecipes[category].slice(0, 4).map((recipe, index) => (
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
                      <Badge bg="secondary mb-2">{calculateAverageRating(recipe.ratings)} Stars</Badge>
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
              <Button 
                variant="primary" 
                className="mb-4" 
                onClick={() => navigate(`/category/${category}`)}
              >
                Learn More About {category}
              </Button>
            </div>
      ))}
      </Container>
      <Footer/>
    </Container>
  );
};

export default Dashboard;
