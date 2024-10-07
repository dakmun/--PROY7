import { Link } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import Hero from "../components/Home/Hero";
import Register from "../components/Register/Register";




export default function Home() {
  return (
    <>
<Hero/>   
      <Container  sx={{ py: 6 , display: "flex", flexDirection: { xs: "column", sm: "row" },
        
        alignItems: "center", justifyContent: "space-evenly"  }} >
        <Box sx={{ maxWidth: { xs: "100%", sm: "40%" } , textAlign: "start" , height: '60vh' , alignContent: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}>
          Bienvenido
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Explora nuestros productos y encuentra todo lo que necesitas. Nos comprometemos a ofrecer la mejor calidad y servicio a nuestros clientes.
        </Typography>

        <Button
          component={Link}
          to="/products"
          variant="contained"
          color="primary"
          size="large"
          sx={{ textTransform: "none", mb: 8 }}
        >
          Ver Productos
        </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "center" , height: '60vh' }}> 

          <Register />

        </Box>

      </Container>


</>


  );
}
