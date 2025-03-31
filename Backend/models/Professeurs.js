const mongoose = require('mongoose');

const ProfesseurSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    heuresMax: { type: Number, default: 20 },
    avatar: { type: String },
    disponibilites: {
        type: Map,
        of: [String], // Ex: { "Lundi": ["8:00 - 12:00", "13:00 - 17:00"] }
    },
}, { timestamps: true });

module.exports = mongoose.model('Professeur', ProfesseurSchema);
