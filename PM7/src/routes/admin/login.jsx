import { Button, Container } from "@mui/material";
import React, { useState, useEffect } from 'react';
import AdminLogin from "../../components/Login/AdminLogin"; 
import useAuth from "../../contexts/useAuth";   
import { CircularProgress, Typography } from "@mui/material";

import { Navigate } from "react-router-dom";

export default function AdminLoginRoute() {

const { token, handleLogout, user } = useAuth();



if (!token) {
    return (
        <Container sx={{  
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center', py: 8 }}>
        <AdminLogin />
        </Container>
    )
}


if (!user.isAdmin) {
    setTimeout(() => {
        handleLogout()
    }, 900);

    return (
        <Container sx={{  
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center', py: 8 }}>
        <Typography variant="h2" sx={{ mb: 4 }}>
            Cerrando sesión...
        </Typography>
        <CircularProgress />
        </Container>    
        
    )

}




    

return (
<Navigate to="/admin" />
)
}

