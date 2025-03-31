const Cours = require('../models/Cours');

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
        const newCours = new Cours(req.body);
        const saved = await newCours.save();
        res.status(201).json(saved);
    } catch (err) {
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
