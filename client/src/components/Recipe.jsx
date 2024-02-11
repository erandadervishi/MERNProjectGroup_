import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import NavbarComponent from './NavbarComponent';
import Footer from './Footer';

    const Recipe = () => {
        const [recipe, setRecipe] = useState(null);
        const [userRating, setUserRating] = useState(null); 
        const [review, setReview] = useState(""); 
        const [hasReviewed, setHasReviewed] = useState(false);
        const [hoverRating, setHoverRating] = useState(0);
        const { id } = useParams();
        const currentUser = JSON.parse(localStorage.getItem('user'));
    
        const fetchRecipe = useCallback(async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/recipes/${id}`);
                setRecipe(response.data);
    
                const existingRating = response.data.ratings.find(r => r.userId === currentUser.id);
                if (existingRating) {
                    setUserRating(existingRating.rating);
                }
    
                const existingReview = response.data.reviews.find(r => r.userId === currentUser.id);
                setHasReviewed(!!existingReview);
    
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        }, [id, currentUser.id]);
    
        useEffect(() => {
            fetchRecipe();
        }, [fetchRecipe]);

    const submitReview = async () => {
            try {
            await axios.post(`http://localhost:8000/api/recipes/${id}/review`, 
                { userId: currentUser.id, userName: currentUser.username, comment: review },
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );
            setReview("");
            fetchRecipe();
            } catch (error) {
            console.error('Error submitting review:', error);
            }
        };

    useEffect(() => {
        fetchRecipe();
    }, [fetchRecipe]);

    const handleRating = async (rateValue) => {
        if (userRating) {
            alert('You have already rated this recipe.');
            return;
        }

        try {
            await axios.post(`http://localhost:8000/api/recipes/${id}/rate`, { rating: rateValue, userId: currentUser.id });
            setUserRating(rateValue);
            fetchRecipe();
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span className='star_size'
                    key={i} 
                    onClick={() => !userRating && handleRating(i)}
                    onMouseEnter={() => !userRating && setHoverRating(i)}
                    onMouseLeave={() => !userRating && setHoverRating(0)}
                    style={{ cursor: userRating ? 'default' : 'pointer', color: i <= (hoverRating || userRating || 0) ? 'gold' : 'gray' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
    <Container className="mb-4">
        <NavbarComponent />
        <Row className="align-items-stretch mt-5">
            <Col md={6} className="d-flex">
                <div className="shadow rounded" style={{
                    backgroundImage: `url(${recipe.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flex: 1,
                    borderRadius: '0.25rem'
                }}>
                </div>
            </Col>
            <Col md={6}>
                <Card className="h-100">
                    <Card.Body>
                        <h2>{recipe.name}</h2>
                        <p><strong>Description:</strong> {recipe.description}</p>
                        <p><strong>Ingredients:</strong></p>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <p><strong>Category:</strong> {recipe.category}</p>
                        <div>
                            <p>Rate this recipe:</p>
                            {renderStars()}
                            {userRating && <Alert variant="info">You rated this recipe: {userRating} Stars</Alert>}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
                <h4>Leave a Review:</h4>
                <Form>
                    <Form.Group>
                        <Form.Control as="textarea" rows={3} value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review here..." 
                            disabled={hasReviewed}/>
                    </Form.Group>
                    <Button variant="primary mt-2" onClick={submitReview} disabled={hasReviewed}>
                        {hasReviewed ? "Review Submitted" : "Submit Review"}
                    </Button>
                    {hasReviewed && <Alert variant="info" className="mt-2">You have already reviewed this recipe.</Alert>}
                </Form>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
            <h4>Reviews:</h4>
            {recipe.reviews.map((rev, index) => (
                <Card key={index} className="mb-3">
                <Card.Body>
                    <Card.Text>{rev.comment}</Card.Text>
                    <Card.Subtitle className="mb-2 text-muted">
                    Reviewed by {rev.userName} on {new Date(rev.createdAt).toLocaleDateString()}
                    </Card.Subtitle>
                </Card.Body>
                </Card>
            ))}
            </Col>
        </Row>
        <Footer/>
    </Container>
);
};

export default Recipe;
