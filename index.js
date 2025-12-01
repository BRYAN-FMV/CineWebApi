import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // <-- importar cors
import peliculasRoutes from './routes/peliculas.js';
import salaRoutes from './routes/sala.js';
import productoRoutes from './routes/producto.js'; 
import funcionRoutes from './routes/funcion.js';
import asientosRoutes from './routes/asientos.js';
import usuariosRoutes from './routes/usuarios.js';
import reservaRoutes from './routes/reserva.js';
import ventaDetRoutes from './routes/ventaDent.js';
import ventaEncRoutes from './routes/ventaEnc.js';  
import bodyParser from 'body-parser';
import dbClient from './config/dbClient.js';
import ventaDet from './schemas/ventaDet.js';


const app = express();


app.use(cors()); 


app.get('/', (req, res) => {
  res.json({ message: 'CineWebApi is running' });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/peliculas', peliculasRoutes);
app.use('/salas', salaRoutes);
app.use('/funciones', funcionRoutes);
app.use('/productos', productoRoutes); 
app.use('/asientos', asientosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/reserva', reservaRoutes); 
app.use('/ventaDet', ventaDetRoutes);
app.use('/ventaEnc', ventaEncRoutes);

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