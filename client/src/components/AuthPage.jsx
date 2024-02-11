import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    const user =JSON.parse(localStorage.getItem('user'));
    if (user) {
      //navigate('/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = isRegister ? 'register' : 'login';
    try {
      const response = await axios.post(`http://localhost:8000/api/users/${endpoint}`, userData);

      console.log('Login/Register response:', response.data); // For debugging

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      console.log('Navigate to dashboard...')
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error in login/register:', error.response?.data?.msg); // For debugging
      setMessage(error.response?.data?.msg || 'An error occurred');
    }
  };

  return (

    <Container className='p-5 bg_auth'>
      <Row className="justify-content-md-center">
        <Col md={4} className="d-none d-md-block">
        </Col>
        <Col md={4} className='p-5 shadow-sm bg-white bg_opacity outline_off'>
          <h2 className='mb-4'>{isRegister ? 'Register' : 'Login'}</h2>
          {message && <Alert variant="danger">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            {isRegister && (
              <Form.Group controlId="formBasicUsername" className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                />
              </Form.Group>
            )}
            <Form.Group controlId="formBasicEmail" className='mb-3'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button className='mt-3' variant="primary" type="submit">
              {isRegister ? 'Register' : 'Login'}
            </Button>
            <Button variant="link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Button>
          </Form>
        </Col>
        <Col md={4} className="d-none d-md-block">
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;