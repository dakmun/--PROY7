import React from 'react';

class ErrorBoundaryProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error en la página de perfil:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#d1ecf1' }}>
          <h1>¡Error en tu perfil!</h1>
          <p>No pudimos cargar tu información de perfil. Intenta nuevamente más tarde.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundaryProfile;
