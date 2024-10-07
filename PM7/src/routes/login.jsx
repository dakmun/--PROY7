import { Button, Container, Typography, CircularProgress, Alert } from "@mui/material";
import Login from "../components/Login/Login";
import useAuth from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginRoute() {

const { token, user } = useAuth();
const navigate = useNavigate();

if (token && !user.isAdmin) {
  setTimeout(() => {
 navigate('/profile')
}, 900);

return (
    <Container sx={{  
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', py: 8 }}>
       <Alert severity="success" sx={{ mb: 4 , fontSize: '1.5rem' }} >
        Inicio de sesión exitoso
    </Alert>
  < Typography variant="h2" sx={{ mb: 4 }}>
  Redirigiendo a la página de Perfil...
</Typography>
    <CircularProgress />
    </Container>    
    
)
}

if (token && user.isAdmin) {
  setTimeout(() => {
 navigate('/admin')
}, 900);

return (
    <Container sx={{  
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', py: 8 }}>
       <Alert severity="success" sx={{ mb: 4 , fontSize: '1.5rem' }} >
        Inicio de sesión exitoso como Administrador
    </Alert>
  < Typography variant="h2" sx={{ mb: 4 }}>
  Redirigiendo a la página de Administrador...
</Typography>
    <CircularProgress />
    </Container>    
    
)
}


  return ( 
  <Container sx={{  
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center', py: 8 }}>
  <Login />
  </Container>
)
}

