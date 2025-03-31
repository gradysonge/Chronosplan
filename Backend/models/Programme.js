const mongoose = require('mongoose');

const ProgrammeSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    etapes: [
        {
            id: { type: String, required: true },
            nom: { type: String, required: true },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Programme', ProgrammeSchema);
