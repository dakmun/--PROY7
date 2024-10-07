import React, { Component } from 'react';
import { Link } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '50px', color: '#fff', backgroundColor: '#222' }}>
          <h1>Oops, algo salió mal.</h1>
          <p>Un error inesperado ha ocurrido.</p>
          <Link to="/" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: 'bold' }}>
            Volver a la página principal
          </Link>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
