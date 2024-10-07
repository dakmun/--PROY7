import { createTheme } from '@mui/material/styles';
import {  blueGrey, blue, pink } from '@mui/material/colors';
import  '@fontsource/montserrat';

// Light mode theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: blue[800],
    },
    secondary: {
      main: pink[800],
    },
    background: {
      default: 'white',
      paper: '#f4f4f4',
      color: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      textDecoration: 'none',
      color: 'inherit',

    },
    color: 'black',
  },
  shape: {
    borderRadius: 8,
  },
link: { textDecoration: 'none' },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '28px',
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8, // 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px

  responsiveFontSizes: true,    




});








// Dark mode theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[800],
    },
    secondary: {
      main: pink[800],
    },
    background: {
      paper: '#28323d',
      default: '#141a21',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {

    MuiBox: {
      styleOverrides: {
        root: {
          borderRadius: '0',
    
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
 
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '28px',
        },
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8, // 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px

  responsiveFontSizes: true,    
});

export { lightTheme, darkTheme };

