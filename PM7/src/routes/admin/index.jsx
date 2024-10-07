import useAuth from '../../contexts/useAuth';
import  ManageProductsSection  from '../../components/admin/ManageProductsSection';
import ManageOrdersSection from '../../components/admin/ManageOrdersSection';
import ManageUsersSection from '../../components/admin/ManageUsersSection';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AdminLogin from '../../components/Login/AdminLogin';



export default function AdminIndex() {
  
  const { token, user } = useAuth();




if (!token) {
  return(
    
    <Container sx={{  
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center', py: 8 }}>
  <AdminLogin />
  </Container>
     
    )
}

if (token && !user.isAdmin) {
  return(

    <Container sx={{  
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center', py: 8 }}>
  <Typography variant="h2" sx={{ mb: 4 }}>
      No autorizado, Inicia sesión como administrador
  </Typography>
  <Button component={Link} to="/admin/login" variant="contained" color="primary">Iniciar sesión</Button>
  </Container>  

  )

}

  return (
<Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
   <Typography variant="h4" sx={{ mb: 8, textAlign: 'center' }} >   Panel de Administración    </Typography>

        <ManageProductsSection />
        <ManageOrdersSection />        
        <ManageUsersSection />

    </Container>
  );
}
