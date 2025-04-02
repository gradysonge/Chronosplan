const mongoose = require('mongoose');

const CreneauSchema = new mongoose.Schema({
  jour: { type: String, required: true },
  heureDebut: { type: String, required: true },
  heureFin: { type: String, required: true },
  professeur: {
    id: String,
    nom: String
  },
  cours: {
    id: String,
    nom: String,
    code: String
  },
  modeCours: {
    id: String,
    nom: String,
    icone: String
  },
  groupe: { type: String, required: true },
  etapeId: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('Creneau', CreneauSchema);
