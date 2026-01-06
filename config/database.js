const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Options pour éviter les warnings de dépréciation
        });

        console.log(`MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
