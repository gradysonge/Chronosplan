const Horaire = require('../models/Horaire');

// Récupérer tous les horaires
exports.getHoraires = async (req, res) => {
  try {
    const horaires = await Horaire.find();
    res.json(horaires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter un nouvel horaire
exports.addHoraire = async (req, res) => {
  try {
    const nouvelHoraire = new Horaire(req.body);
    const saved = await nouvelHoraire.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour un horaire
exports.updateHoraire = async (req, res) => {
  try {
    const updated = await Horaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un horaire
exports.deleteHoraire = async (req, res) => {
  try {
    await Horaire.findByIdAndDelete(req.params.id);
    res.json({ message: 'Horaire supprimé' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
