const express = require('express');
const router = express.Router();
const {
    getCours,
    addCours,
    updateCours,
    deleteCours,
} = require('../controllers/coursController');

router.get('/', getCours);
router.post('/', addCours);
router.put('/:id', updateCours);
router.delete('/:id', deleteCours);

module.exports = router;
