export const validerLimiteCoursProfesseur = (creneauxParEtape, etapeVueSelectionnee, professeur, cours, groupe, jour, heureDebut, heuresConsecutives) => {
  const creneauxEtapeActuelle = creneauxParEtape[etapeVueSelectionnee?.id] || [];

  // Filtrer les créneaux pour le professeur, le cours et le groupe donné
  const creneauxProfesseurCours = creneauxEtapeActuelle.filter(creneau =>
    creneau.professeur.id === professeur.id &&
    creneau.cours.code === cours.code &&
    creneau.groupe === groupe &&
    creneau.etapeId === etapeVueSelectionnee.id &&
    cours.programmeId === creneau.cours.programmeId
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

export const validerLimiteCoursGroupe = (
  creneauxParEtape,
  etapeVueSelectionnee,
  groupe,
  cours, // cours au lieu de coursId
  heuresAAjouter
) => {
  const creneauxEtape = creneauxParEtape[etapeVueSelectionnee?.id] || [];

  const totalHeures = creneauxEtape
    .filter(c =>
      c.cours.id === cours.id &&
      c.cours.programmeId === cours.programmeId &&
      c.groupe === groupe &&
      c.etapeId === etapeVueSelectionnee.id
    )
    .reduce((acc, curr) => {
      const debut = parseInt(curr.heureDebut);
      const fin = parseInt(curr.heureFin);
      return acc + (fin - debut);
    }, 0);

  return (totalHeures + heuresAAjouter) <= 3;
};





export const respecteLimiteHeuresCoursProfesseurGroupe = (
  creneauxParEtape,
  etapeVueSelectionnee,
  professeurId,
  groupe,
  coursId,
  heuresAAjouter
) => {
  const creneauxEtape = creneauxParEtape[etapeVueSelectionnee?.id] || [];

  const totalHeures = creneauxEtape
    .filter(c =>
      c.cours.id === coursId &&
      c.professeur.id === professeurId &&
      c.groupe === groupe &&
      c.etapeId === etapeVueSelectionnee.id // ✅ distinction par étape
    )
    .reduce((acc, curr) => {
      const debut = parseInt(curr.heureDebut);
      const fin = parseInt(curr.heureFin);
      return acc + (fin - debut);
    }, 0);

  return (totalHeures + heuresAAjouter) <= 3;
};
