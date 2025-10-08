import mongoose from "mongoose";
import 'dotenv/config';
import peliculaModel from '../model/peliculas.js';

class dbClient {
    constructor() {
        this.connected = false;
    }

    async connect() {
        const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.SERVER_DB}/Cine?retryWrites=true&w=majority`;
        try {
            await mongoose.connect(queryString);
            this.connected = true;
            console.log("Conectado a la base de datos MongoDB Atlas");
        } catch (error) {
            this.connected = false;
            console.error("Error al conectar a la base de datos MongoDB Atlas:", error);
        }
    }

    async close() {
        if (this.connected) {
            await mongoose.connection.close();
            this.connected = false;
            console.log("Conexión a MongoDB cerrada");
        }
    }
}

export default new dbClient();