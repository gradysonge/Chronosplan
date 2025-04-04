const Creneau = require('../models/Creneau'); // modèle à créer si pas encore fait

exports.ajouterCreneau = async (req, res) => {
  try {
    const nouveau = new Creneau(req.body);
    const saved = await nouveau.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getCreneauxParEtape = async (req, res) => {
  try {
    const creneaux = await Creneau.find({ etapeId: req.params.etapeId });
    res.json(creneaux);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les créneaux par professeur
exports.getCreneauxParProfesseur = async (req, res) => {
  try {
    const professeurId = req.query.professeurId;
    if (!professeurId) {
      return res.status(400).json({ error: "L'ID du professeur est requis" });
    }
    
    // Rechercher par professeur.id ou professeur._id pour assurer la compatibilité
    const creneaux = await Creneau.find({
      $or: [
        { 'professeur.id': professeurId },
        { 'professeur._id': professeurId }
      ]
    });
    
    res.json(creneaux);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.supprimerCreneau = async (req, res) => {
  try {
    await Creneau.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Créneau supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.supprimerPlageCreneaux = async (req, res) => {
  try {
    const { jour, professeurId, coursId, groupe, etapeId } = req.body;

    const result = await Creneau.deleteMany({
      jour,
      $or: [
        { 'professeur.id': professeurId },
        { 'professeur._id': professeurId }
      ],
      $or: [
        { 'cours.id': coursId },
        { 'cours._id': coursId }
      ],
      groupe,
      etapeId
    });

    res.status(200).json({ message: 'Plage supprimée', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
