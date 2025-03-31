const express = require('express');
const router = express.Router();
const {
    getProgrammes,
    addProgramme,
    updateProgramme,
    deleteProgramme,
} = require('../controllers/programmeController');

router.get('/', getProgrammes);
router.post('/', addProgramme);
router.put('/:id', updateProgramme);
router.delete('/:id', deleteProgramme);

module.exports = router;
