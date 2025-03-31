const express = require('express');
const router = express.Router();
const {
    getProfesseurs,
    addProfesseur,
    updateProfesseur,
    deleteProfesseur
} = require('../controllers/professeurController');

router.get('/', getProfesseurs);
router.post('/', addProfesseur);
router.put('/:id', updateProfesseur);
router.delete('/:id', deleteProfesseur);

module.exports = router;
