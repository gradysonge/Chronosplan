const express = require('express');
const router = express.Router();
const {
    getHoraires,
    addHoraire,
    updateHoraire,
    deleteHoraire,
} = require('../controllers/horaireController');

router.get('/', getHoraires);
router.post('/', addHoraire);
router.put('/:id', updateHoraire);
router.delete('/:id', deleteHoraire);

module.exports = router;

