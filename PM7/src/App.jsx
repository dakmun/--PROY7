import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import Layout from './components/Layout/Layout';
import Home from './routes/_index';
import CartRoute from './routes/cart';
import MercadoPagoRoute from './routes/mercadopago';
import CheckoutRoute from './routes/checkout';
import LoginRoute from './routes/login';
import ProductsPageIndex from './routes/products';
import ProductPage from './routes/products.$id';
import ProfileRoute from './routes/profile';
import ErrorPage from './routes/error';
import RegisterPage from './routes/register';
import AdminIndex from './routes/admin/index';
import AdminLoginRoute from './routes/admin/login';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundaryProfile from './components/ErrorBoundaries/ErrorBoundaryProfile';




export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}  >
                <Route index element={<Home />} />

                <Route path='error' element={<ErrorPage />} />
                <Route path="cart" element={<CartRoute />} />
                <Route path="checkout" element={<CheckoutRoute />} />
                <Route path="mercadopago" element={<MercadoPagoRoute />} />       
                <Route path="login" element={<LoginRoute />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="products" element={<ProductsPageIndex />} />
                <Route path="products/:id" element={<ProductPage />} /> 
               <Route path="profile" 
                element={ 
                  <ErrorBoundaryProfile>
                  <ProfileRoute />
                  </ErrorBoundaryProfile> 
                  } />
                  
           
                <Route path="admin" element={<AdminIndex />} />
                <Route path="admin/login" element={<AdminLoginRoute />} />
        
          </Route>
          
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}
