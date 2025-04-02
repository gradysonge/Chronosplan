const express = require('express');
const router = express.Router();
const { ajouterCreneau, getCreneauxParEtape, supprimerCreneau } = require('../controllers/creneauController');

router.post('/', ajouterCreneau);
router.get('/:etapeId', getCreneauxParEtape);
router.delete('/:id', supprimerCreneau);
router.post('/supprimer-plage', require('../controllers/creneauController').supprimerPlageCreneaux);


module.exports = router;

