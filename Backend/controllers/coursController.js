const Cours = require('../models/Cours');
const mongoose = require('mongoose');

exports.getCours = async (req, res) => {
    try {
        const cours = await Cours.find().populate('programmeId');
        res.json(cours);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.addCours = async (req, res) => {
  try {
    console.log("▶️ Données reçues :", req.body);

    // S’assurer que programmeId est bien un ObjectId
    req.body.programmeId = new mongoose.Types.ObjectId(req.body.programmeId);

    const newCours = new Cours(req.body);
    const saved = await newCours.save();
    console.log("✅ Cours ajouté :", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Erreur ajout cours :", err);

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Ce cours existe déjà pour ce programme et cette étape.",
        details: err.keyValue
      });
    }

    res.status(400).json({ error: err.message });
  }
};

  


exports.updateCours = async (req, res) => {
    try {
        const updated = await Cours.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCours = async (req, res) => {
    try {
        await Cours.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cours supprimé' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
