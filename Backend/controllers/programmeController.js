const Programme = require('../models/Programme');

exports.getProgrammes = async (req, res) => {
    try {
        const programmes = await Programme.find();
        res.json(programmes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProgramme = async (req, res) => {
    try {
        const newProgramme = new Programme(req.body);
        const saved = await newProgramme.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProgramme = async (req, res) => {
    try {
        const updated = await Programme.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteProgramme = async (req, res) => {
    try {
        await Programme.findByIdAndDelete(req.params.id);
        res.json({ message: 'Programme supprimé' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
