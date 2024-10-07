import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de usar 'jwt-decode'


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);


  // Utilizamos useCallback para evitar recrear la función en cada renderización
  const handleTokenValidation = useCallback((storedToken) => {
    try {
      const decodedToken = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token expirado, limpiar sesión
        handleLogout();  // No necesita ser useCallback, ya que no depende de variables externas
        window.location.reload(); // Recargar la página para limpiar el estado
      } else {
        setToken(storedToken);
        setUser(() => ({
          _id: decodedToken._id,
          isAdmin: decodedToken.isAdmin,
        }));
      }
    } catch (err) {
      console.error('Token decoding failed:', err);
      handleLogout();
      window.location.reload(); // Recargar la página para limpiar el estado
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      handleTokenValidation(storedToken);
    }
  }, [handleTokenValidation]); // Agregamos handleTokenValidation como dependencia

  // handleLogin actualizado para usar la versión previa del estado
  const handleLogin = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    handleTokenValidation(newToken);
    setIsLoggedOut(() => false); // Usamos callback para asegurarnos que se está usando la última versión de isLoggedOut
  }, [handleTokenValidation]);

  // handleLogout actualizado para asegurar que se usa el estado más reciente
  const handleLogout = useCallback(() => {
    setToken(() => null);  // Al usar callbacks, garantizamos que no haya referencias antiguas del estado
    setUser(() => null);
    localStorage.removeItem('token');
    setIsLoggedOut(() => true); // Resetear estado de logout
  }, []);





  return (
    <AuthContext.Provider value={{ token, user, setUser, handleLogin, handleLogout,  }}>
      {isLoggedOut ? window.location.reload() : children}
    </AuthContext.Provider>
  );

}
