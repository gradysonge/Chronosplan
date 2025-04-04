const express = require('express');
const router = express.Router();
const { ajouterCreneau, getCreneauxParEtape, supprimerCreneau, getCreneauxParProfesseur, supprimerPlageCreneaux } = require('../controllers/creneauController');

router.post('/', ajouterCreneau);
router.get('/', getCreneauxParProfesseur); // Route pour récupérer les créneaux par professeur
router.get('/:etapeId', getCreneauxParEtape);
router.delete('/:id', supprimerCreneau);
router.post('/supprimer-plage', supprimerPlageCreneaux);

module.exports = router;
