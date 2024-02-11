import React from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavbarComponent = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        axios.defaults.headers.common['x-auth-token'] = null;
        navigate('/');
    };

    // Assuming these are your categories
    const categories = ['Dessert', 'Main Course', 'Appetizer', 'Salad', 'Beverage'];

    return (
        <Navbar bg="" expand="lg" className="py-3 px-4 shadow bg-white justify-content-between">
            <Navbar.Brand href="/dashboard">Cooking MERN</Navbar.Brand>
            <Nav className="">
                <Nav.Link href="/dashboard">All Recipes</Nav.Link>
                <Nav.Link href={`/reviews`}>All Reviews</Nav.Link>
                <Nav.Link href="/add-recipe">Add a Recipe</Nav.Link>
                <NavDropdown title="Recipe Categories" id="nav-dropdown">
                    {categories.map((category, index) => (
                        <NavDropdown.Item key={index} href={`/category/${category}`}>
                            {category}
                        </NavDropdown.Item>
                    ))}
                </NavDropdown>
            </Nav>
            <Navbar className="justify-content-end">
                <Navbar.Text>
                    Welcome: <a href="#login">{user ? user.username : 'Guest'}</a>
                </Navbar.Text>
                {user && (
                    <Button variant="outline-danger" onClick={signOut} className="ms-2 pt-0 pb-1">
                        Sign Out
                    </Button>
                )}
            </Navbar>
        </Navbar>
    );
};

export default NavbarComponent;
