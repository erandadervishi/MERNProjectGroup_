import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AddRecipeForm from './components/AddReciepForm';
import PrivateRoute from './components/PrivateRoute';
import Recipe from './components/Recipe';
import EditRecipe from './components/EditRecipe';
import Category from './components/Category';
import AllReviews from './components/AllReviews';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-recipe"
          element={
            <PrivateRoute>
              <AddRecipeForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <PrivateRoute>
              <Recipe />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditRecipe />
            </PrivateRoute>
          }
        />
        <Route
          path="/category/:category"
          element={
            <PrivateRoute>
              <Category />
            </PrivateRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <AllReviews />
            </PrivateRoute>
          }
        />
        {/* Redirect any unknown routes to the main page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
