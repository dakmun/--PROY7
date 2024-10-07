import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'; // Para manejar rutas de archivos
import { fileURLToPath } from 'url';

// Importar las rutas de la API
import userRoutes from './routes/usersRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import mercadopagoRoutes from './routes/mercadopagoRoutes.mjs';
import process from 'node:process';

dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);  // Solo pasamos el URI
      console.log('Conectado a MongoDB');
    } catch (error) {
      console.error('Error conectando a MongoDB:', error);
      process.exit(1);  // Finalizar el proceso si hay un error
    }
  };


await connectDB();

const app = express();




// Middleware de seguridad y configuración
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://sdk.mercadopago.com", "https://http2.mlstatic.com"],
        connectSrc: [
          "'self'",
          "https://sdk.mercadopago.com",
          "https://http2.mlstatic.com",
          "https://api.mercadopago.com",
          "https://events.mercadopago.com",
          "https://api.mercadolibre.com",
          "https://api-static.mercadopago.com",
          "https://www.mercadolibre.com"
        ],
        frameSrc: [
          "'self'",
          "https://sdk.mercadopago.com",
          "https://http2.mlstatic.com",
          "https://api.mercadopago.com",
          "https://www.mercadolibre.com",
          "https://api-static.mercadopago.com"
        ], // Permitir iframes desde estos dominios
        imgSrc: ["'self'", "http:", "https:", "data:"],
      },
    },
  })
);




        




app.use(cors({
  origin: 'http://localhost:5173'  // Permitir solo tu frontend
}));

app.use(compression()); // Comprime las respuestas
app.use(express.json()); // Parseo de JSON en solicitudes
app.use(morgan('tiny')); // Registro de solicitudes HTTP

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/mercadopago',  mercadopagoRoutes); // Ruta para Mercado Pago






// Manejar archivos estáticos de Vite en producción
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV  === 'production' || process.env.NODE_ENV === 'development') {
  // Servir los archivos estáticos construidos por Vite (carpeta /dist)
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));

  // Para cualquier otra ruta, servir el archivo index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  // Configurar Vite en desarrollo para manejar la recarga en caliente (hot reload)
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: 'html' },
  });

  app.use(vite.middlewares);
}

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error en el servidor', error: err.message });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
