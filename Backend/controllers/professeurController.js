const Professeur = require('../models/Professeurs');

// Récupérer tous les professeurs
exports.getProfesseurs = async (req, res) => {
    try {
        const professeurs = await Professeur.find();
        res.json(professeurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ajouter un professeur
exports.addProfesseur = async (req, res) => {
    try {
        const nouveauProfesseur = new Professeur(req.body);
        const savedProfesseur = await nouveauProfesseur.save();
        res.status(201).json(savedProfesseur);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Modifier un professeur
exports.updateProfesseur = async (req, res) => {
    try {
        const updatedProfesseur = await Professeur.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProfesseur);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un professeur
exports.deleteProfesseur = async (req, res) => {
    try {
        await Professeur.findByIdAndDelete(req.params.id);
        res.json({ message: "Professeur supprimé" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
