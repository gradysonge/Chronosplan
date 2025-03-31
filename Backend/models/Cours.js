const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    description: { type: String },
    credits: { type: Number, default: 3 },
    programmeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
    etapeId: { type: String, required: true },
    groupes: [{type: String}],
}, { timestamps: true });

module.exports = mongoose.model('Cours', CoursSchema);
