import Register from "../components/Register/Register";
import { Container } from "@mui/material";

export default function RegisterPage() {

  return ( 
    <Container sx={{  
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center', py: 6 }}>
    <Register />
    </Container>
  )

}