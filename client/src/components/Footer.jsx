import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer>
            {/* Top part of the footer */}
            <div className="footer-top bg-dark text-white py-5 bg_dark_pattern px-3">
                <Container>
                    <Row>
                        <Col md={6}>
                            <h5>About Us</h5>
                            <div class="title-shape my-3"></div>
                            <p>
                                We are passionate about sharing delightful recipes and 
                                culinary experiences from around the world. Join us and 
                                explore the joy of cooking!
                            </p>
                        </Col>
                        <Col md={3}>
                            <h5>Quick Links</h5>
                            <div class="title-shape my-3"></div>
                            <ul className="list-unstyled">
                                <li><a href="/dashboard" className="text-white">Home</a></li>
                                <li><a href="/add-recipe" className="text-white">Add Recipe</a></li>
                                <li><a href="/reviews" className="text-white">All Reviews</a></li>
                            </ul>
                        </Col>
                        <Col md={3}>
                            <h5>Contact</h5>
                            <div class="title-shape my-3"></div>
                            <p>Email: contact@cookingmern.com</p>
                            <p>Phone: +123 456 7890</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Bottom part of the footer */}
            <div className="footer-bottom bg-black text-white py-3">
                <Container>
                    <Row>
                        <Col className="text-center">
                            © 2024 Cooking MERN. All rights reserved.
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
