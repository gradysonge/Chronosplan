export const validerLimiteCoursProfesseur = (creneauxParEtape, etapeVueSelectionnee, professeur, cours, groupe, jour, heureDebut, heuresConsecutives) => {
  const creneauxEtapeActuelle = creneauxParEtape[etapeVueSelectionnee?.id] || [];

  // Filtrer les créneaux pour le professeur, le cours et le groupe donné
  const creneauxProfesseurCours = creneauxEtapeActuelle.filter(creneau =>
    creneau.professeur.id === professeur.id &&
    creneau.cours.code === cours.code &&
    creneau.groupe === groupe
  );

  // Calculer le total des heures déjà attribuées pour ce cours, ce professeur et ce groupe
  const totalHeures = creneauxProfesseurCours.reduce((total, creneau) => {
    const heuresCreneau = parseInt(creneau.heureFin) - parseInt(creneau.heureDebut);
    return total + heuresCreneau;
  }, 0);

  // Vérifier si l'ajout de ce créneau dépasse la limite de 3 heures
  if (totalHeures + heuresConsecutives > 3) {
    return false; // Limite dépassée
  }

  return true; // Limite respectée
};