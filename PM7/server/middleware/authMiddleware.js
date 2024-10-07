import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

 // Middleware de autenticación
export const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró el token' });
  }

  try {

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);
    
    // Agregar el usuario autenticado a la solicitud
    req.user = { _id: decoded._id, isAdmin: decoded.isAdmin };
    next();
    
  }
  catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
}
