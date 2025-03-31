const mongoose = require('mongoose');

const HoraireSchema = new mongoose.Schema({
    jour: { type: String, required: true },              // Exemple : "Lundi"
    heureDebut: { type: String, required: true },          // Exemple : "8:00"
    heureFin: { type: String, required: true },            // Exemple : "9:00"
    professeur: { 
       id: { type: String, required: true },
       nom: { type: String, required: true },
       avatar: { type: String }
    },
    cours: {
       code: { type: String, required: true },
       nom: { type: String, required: true }
    },
    groupe: { type: String, required: true },
    modeCours: {
       id: { type: String, required: true },
       nom: { type: String, required: true },
       icone: { type: String }
    },
    etapeId: { type: String, required: true },
    couleur: { 
       bg: { type: String },
       badge: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Horaire', HoraireSchema);
