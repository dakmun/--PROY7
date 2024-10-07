import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './themes'; // Importa los temas

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  // Al iniciar, buscamos el valor en localStorage o por defecto asumimos light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Función para alternar el tema y guardarlo en localStorage
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('isDarkMode', JSON.stringify(newMode)); // Guardar preferencia en localStorage
      return newMode;
    });
  };

  // Establecemos el tema de acuerdo al valor de isDarkMode
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
