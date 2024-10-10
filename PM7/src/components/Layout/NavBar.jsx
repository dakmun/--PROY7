import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  Modal,
  Card,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../themes/ThemeContext';
import useAuth from '../../contexts/useAuth';
import useCart from '../../contexts/useCart';


export default function NavBar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, handleLogout } = useAuth();
  const { clearCart, cartLength } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  // Manejar la visibilidad del Navbar durante el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true); // Activa el efecto de vidrio al hacer scroll
      } else {
        setIsScrolled(false); // Volver al color sólido en top 0
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Manejar la apertura/cierre del menú móvil
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Manejar el logout
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogoutAndClearCart = () => {
    handleLogout();
    clearCart();
    closeLogoutModal(); // Cerrar modal después de cerrar sesión
  };

  // Efecto de vidrio en la barra de navegación al hacer scroll
  const glassEffect = {
    backgroundColor: isScrolled?
       isDarkMode
        ? 'rgba(20, 26, 33, 0.5)' // Fondo semitransparente en dark mode con scroll
        : 'rgba(255, 255, 255, 0.5)' // Fondo semitransparente en light mode con scroll
      : isDarkMode
      ? '#141a21' // Color sólido en dark mode cuando está en top 0
      : '#fff', // Color blanco sólido en light mode cuando está en top 0
    backdropFilter: isScrolled ? 'blur(10px)' : 'none', // Aplicar el desenfoque al hacer scroll
    backgroundImage: 'none', // Eliminar la imagen de fondo
    boxShadow: 'none', // Eliminar la sombra
    // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombras suaves
    // transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease', // Suave transición entre los estados

    borderBottom: isDarkMode ? '1px solid #1e2327' : '1px solid #e8eaee',
  };

    // Cambia el color de las letras basado en el tema (oscuro o claro)
    const textColor = isDarkMode ? '#fff' : '#000';
    // Cambia el color de los iconos basado en el tema
    const iconColor = isDarkMode ? '#fff' : '#555';

  // Menú móvil
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' , backgroundColor: isDarkMode ? '#141a21' : '#fff'  , height: '100vh' }}>
      <Typography variant="h6" noWrap sx={{ flexGrow: 1 , my: '5px' }}> 
          <Button component={Link} to="/" sx={{ color: textColor , justifyContent: 'flex-start' , fontSize: '1.2rem' }}>
            LOGO.
            </Button> </Typography>
      <Divider />
      <List>
          <ListItem button='true'  component={Link} to='/'sx={{ color: isDarkMode ? '#fff' : '#000'}} > Home </ListItem>
          <ListItem button='true'  component={Link} to='/products'sx={{ color: isDarkMode ? '#fff' : '#000'}}  > Productos </ListItem>
          <ListItem button='true'  component={Link} to='/profile' sx={{ color: isDarkMode ? '#fff' : '#000'}} > Perfil </ListItem>
          <ListItem button='true'  component={Link} to='/admin'sx={{ color: isDarkMode ? '#fff' : '#000'}}  > Admin </ListItem>
      </List>
    </Box>
  );



  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Navbar */}
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          ...glassEffect, // Aplica el efecto de vidrio según el scroll
          color: isDarkMode ? '#fff' : '#000', // Letras blancas en dark mode, negras en light mode
        }}
      >
        <Toolbar
           component="nav"
        >
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: iconColor }} // Aplicar color condicionalmente a los íconos
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/" sx={{ color: textColor , justifyContent: 'flex-start' , fontSize: '1.2rem' }}>
            LOGO.
            </Button> </Typography>
         
     

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Button component={Link} to="/" sx={{ color: textColor, mx: 1 }}>
              Home
            </Button>
            <Button component={Link} to="/products" sx={{ color: textColor, mx: 1 }}>
              Productos
            </Button>
            <Button component={Link} to="/profile" sx={{ color: textColor, mx: 1 }}>
              Perfil
            </Button>
            <Button component={Link} to="/admin" sx={{ color: textColor, mx: 1 }}>
              Admin
            </Button>
          </Box>

          {/* User and Cart Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Button
                  onClick={openLogoutModal}
                  variant="contained"
                  color="secondary"
                  size='small'
                  sx={{  display: {  }, marginRight: '10px' }}
                >
                  Logout
                </Button>
                <Modal open={isLogoutModalOpen} onClose={closeLogoutModal}>
                  <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 4, borderRadius: 2 , minWidth: '340px' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      ¿Estás seguro de que quieres cerrar sesión?
                    </Typography>
                    <Button
                      onClick={handleLogoutAndClearCart}
                      color="secondary"
                      variant="contained"
                      sx={{ mr: 2 }}
                    >
                      Confirmar Logout
                    </Button>
                    <Button onClick={closeLogoutModal} color="primary" variant="outlined">
                      Cancelar
                    </Button>
                  </Card>
                </Modal>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                   size='small'
                sx={{   display: {  }, marginRight: '10px' }}
              >
                Login
              </Button>
            )}

            <IconButton onClick={toggleTheme} sx={{ color: iconColor }}> {/* Aplicar color condicional a íconos */}
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
              <IconButton size="large" sx={{ color: iconColor }}> {/* Aplicar color condicional a íconos */}
                <Badge badgeContent={cartLength()} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>

{user? (
             <IconButton component={Link} to="/profile"  size="large" sx={{ color: iconColor }}> {/* Aplicar color condicional a íconos */}                       
             <Badge   
                 badgeContent={''}
                 variant='dot' 
                 color="success"
                 anchorOrigin={{vertical: 'top',  horizontal: 'right', }}
          
                 >     
               <AccountCircleIcon />    
             </Badge>
           </IconButton>

               ):(           

              <IconButton component={Link} to="/profile"  size="large" sx={{ color: iconColor }}>                     
                <Badge   
                    badgeContent={''}
                    variant='dot' 
                    color="error"
                    anchorOrigin={{vertical: 'top',  horizontal: 'right', }}
   

                    >     
                  <AccountCircleIcon />    
                </Badge>
              </IconButton>
              )}

          </Box>
        </Toolbar>
      </AppBar>


      {/* Drawer para el menú móvil */}
      <Box component="nav">
        <Drawer
        component={Box}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },

            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240  }
          
        
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
