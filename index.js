import 'dotenv/config';
import express from 'express';
import peliculasRoutes from './routes/peliculas.js';
import salaRoutes from './routes/sala.js';
import productoRoutes from './routes/producto.js'; 
import funcionRoutes from './routes/funcion.js';
import bodyParser from 'body-parser';
import dbClient from './config/dbClient.js';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/peliculas', peliculasRoutes);
app.use('/salas', salaRoutes);
app.use('/funciones', funcionRoutes);
app.use('/productos', productoRoutes); 

try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('servidor escuchando en el puerto', PORT);
    }); 
} catch (error) {
    console.error('Error en el serividor:', error);
}

process.on('SIGINT', async () => {
    await dbClient.disconnectDB();
    process.exit(0);
});

await dbClient.connect();
// ...inicia tu servidor Express...