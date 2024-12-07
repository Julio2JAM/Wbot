import cors from 'cors';
import express from 'express';
import { initServiceWS } from './bot';

//Se inicializa la app con express
const app = express();

// Configurar CORS para poder recibir solicitudes a la api desde cualquier origen
app.use(cors());

// Analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

//Puerto en cual se reciben las peticiones
const PORT = 3000;

// Server escuchando al puerto establecido
app.listen(PORT, () => console.log(`Escuchando el puerto ${PORT}`));

// Iniciar Bot de WhatsApp
export const client = initServiceWS();