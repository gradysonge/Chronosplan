const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
    code: { type: String, required: true },
    nom: { type: String, required: true },
    description: { type: String },
    credits: { type: Number, default: 3 },
    programmeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
    etapeId: { type: String, required: true },
    groupes: [{ type: String }],
}, { timestamps: true });

// 🛠️ Unicité du code par programme
CoursSchema.index({ code: 1, programmeId: 1, etapeId: 1 }, { unique: true });

module.exports = mongoose.model('Cours', CoursSchema);
