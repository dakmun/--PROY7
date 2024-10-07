import Profile from '../components/Profile/Profile';
import useAuth from '../contexts/useAuth';
import Login from '../components/Login/Login';
import { Container } from '@mui/material';

export default function ProfileRoute() {

    const { user, token } = useAuth();

    if (!user || !token) {

        return (
        <>
          <Container sx={{  
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center', py: 8 }}>
      
            <Login />
            </Container>
        
        </>
        )

    } else {
        return <Profile />;
    }

}


