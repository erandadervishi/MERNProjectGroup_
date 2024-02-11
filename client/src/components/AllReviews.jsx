import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, Container, Row, Col } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent';
import Footer from './Footer';

const AllReviews = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/recipes');
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <Container fluid className="p-4 bg-light">
            <NavbarComponent />
            <Row className='justify-content-center p-5'>
            {recipes.map((recipe, index) => (
                <Col md={6} key={index} className="mb-4">
                    <Card className="shadow h-100">
                        <Card.Header as="h5" className="my_bg">{recipe.name}</Card.Header>
                        <ListGroup variant="flush">
                            {recipe.reviews.length > 0 ? (
                                recipe.reviews.map((review, idx) => (
                                    <ListGroup.Item key={idx}>
                                        <strong>{review.userName}:</strong> {review.comment}
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>No reviews yet.</ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            ))}
            </Row>
            <Footer/>
        </Container>
    );
};

export default AllReviews;