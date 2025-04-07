const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Test modèles
const Professeur = require('./models/Professeurs');
const Cours = require('./models/Cours');
const Programme = require('./models/Programme');

// Import des routes
const professeurRoutes = require('./routes/professeurRoutes');
const programmeRoutes = require('./routes/programmeRoutes');
const coursRoutes = require('./routes/coursRoutes');
const horaireRoutes = require('./routes/horaireRoutes'); // Importer la route des horaires

const app = express(); // Définir l'application avant d'utiliser app.use()

// Middleware
app.use(cors());
app.use(express.json());

// Utilisation des routes
app.use('/api/professeurs', professeurRoutes);
app.use('/api/programmes', programmeRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/creneaux', require('./routes/creneauRoutes'));



// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connecté 🎉'))
    .catch(err => console.error('Erreur MongoDB:', err));

// Route test
app.get('/', (req, res) => {
    res.send('API fonctionnelle 🚀');
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
