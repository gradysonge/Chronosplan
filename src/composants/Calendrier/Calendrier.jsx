import React, { useState, useContext, useEffect } from 'react';
import EnTeteCalendrier from './EnTeteCalendrier';
import CreneauHoraire from './CreneauHoraire';
import SelecteurEtape from './SelecteurEtape';
import StatistiquesProfesseur from './StatistiquesProfesseur';
import { ContexteAuth } from '../../contexte/Authentification';
import { X, Clock, BookOpen, Users, Monitor, Blend, Trash2, XCircle } from 'lucide-react';
import { validerLimiteCoursProfesseur, respecteLimiteHeuresCoursProfesseurGroupe, validerLimiteCoursGroupe  } from '../../utils/Contraintes';


const joursDelaSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const heures = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

// Définition des couleurs pour les professeurs
const generateurCouleursProfesseurs = () => {
  const couleurs = {
    'default': { bg: 'bg-gray-100 hover:bg-gray-200', badge: 'bg-gray-500' }
  };
  
  const basesCouleurs = [
    { bg: 'bg-blue-100 hover:bg-blue-200', badge: 'bg-blue-500' },
    { bg: 'bg-green-100 hover:bg-green-200', badge: 'bg-green-500' },
    { bg: 'bg-purple-100 hover:bg-purple-200', badge: 'bg-purple-500' },
    { bg: 'bg-orange-100 hover:bg-orange-200', badge: 'bg-orange-500' },
    { bg: 'bg-pink-100 hover:bg-pink-200', badge: 'bg-pink-500' },
    { bg: 'bg-yellow-100 hover:bg-yellow-200', badge: 'bg-yellow-500' },
    { bg: 'bg-indigo-100 hover:bg-indigo-200', badge: 'bg-indigo-500' },
    { bg: 'bg-red-100 hover:bg-red-200', badge: 'bg-red-500' },
    { bg: 'bg-teal-100 hover:bg-teal-200', badge: 'bg-teal-500' },
    { bg: 'bg-cyan-100 hover:bg-cyan-200', badge: 'bg-cyan-500' },
    { bg: 'bg-lime-100 hover:bg-lime-200', badge: 'bg-lime-500' },
    { bg: 'bg-amber-100 hover:bg-amber-200', badge: 'bg-amber-500' },
    { bg: 'bg-emerald-100 hover:bg-emerald-200', badge: 'bg-emerald-500' },
    { bg: 'bg-fuchsia-100 hover:bg-fuchsia-200', badge: 'bg-fuchsia-500' },
    { bg: 'bg-rose-100 hover:bg-rose-200', badge: 'bg-rose-500' },
    { bg: 'bg-violet-100 hover:bg-violet-200', badge: 'bg-violet-500' },
    { bg: 'bg-sky-100 hover:bg-sky-200', badge: 'bg-sky-500' },
    { bg: 'bg-stone-100 hover:bg-stone-200', badge: 'bg-stone-500' },
    { bg: 'bg-zinc-100 hover:bg-zinc-200', badge: 'bg-zinc-500' },
    { bg: 'bg-gray-100 hover:bg-gray-200', badge: 'bg-gray-500' },
  ];
  
  return { couleurs, basesCouleurs };
};

const Calendrier = () => {
  const { estAuthentifie } = useContext(ContexteAuth);
  const [creneauxParEtape, setCreneauxParEtape] = useState({});
  const [filtres, setFiltres] = useState({
    professeur: null,
    cours: null,
    groupe: null,
    modeCours: null,
    etape: null,
    duree: null
  });
  const [etapeVueSelectionnee, setEtapeVueSelectionnee] = useState(null);
  const [creneauSurvole, setCreneauSurvole] = useState(null);
  const [creneauSelectionne, setCreneauSelectionne] = useState(null);
  const [professeursBD, setProfesseursBD] = useState([]);
  const [couleursProfesseurs, setCouleursProfesseurs] = useState({});
  const [raisonIndisponibilite, setRaisonIndisponibilite] = useState(null);

  // Récupération des professeurs depuis l'API
  useEffect(() => {
    fetch('http://localhost:5000/api/professeurs')
      .then(res => res.json())
      .then(data => {
        setProfesseursBD(data);
        
        // Générer les couleurs pour chaque professeur
        const { couleurs, basesCouleurs } = generateurCouleursProfesseurs();
        const couleursMAJ = { ...couleurs };
        
        data.forEach((prof, index) => {
          const couleurIndex = index % basesCouleurs.length;
          couleursMAJ[prof._id] = basesCouleurs[couleurIndex];
        });
        
        setCouleursProfesseurs(couleursMAJ);
      })
      .catch(err => {
        console.error("Erreur chargement professeurs", err);
      });
  }, []);

  useEffect(() => {
    if (!etapeVueSelectionnee) return;
  
    fetch(`http://localhost:5000/api/creneaux/${etapeVueSelectionnee.id}`)
      .then(res => res.json())
      .then(data => {
        const creneauxFormates = data.map(c => ({
          id: c._id, // Utilisez l'ID généré par MongoDB
          jour: c.jour,
          heureDebut: `${c.heureDebut}:00`,
          heureFin: `${c.heureFin}:00`,
          professeur: c.professeur,
          cours: c.cours,
          groupe: c.groupe,
          etapeId: c.etapeId,
          etape: { id: c.etapeId, nom: `Étape ${c.etapeId}` }, // Ajout pour les statistiques
          modeCours: c.modeCours || { id: '', nom: '', icone: '' },
          couleur: couleursProfesseurs[c.professeur.id] || couleursProfesseurs['default'] // Utiliser la couleur du professeur ou une couleur par défaut
        }));
  
        setCreneauxParEtape(prev => ({
          ...prev,
          [etapeVueSelectionnee.id]: creneauxFormates
        }));
      })
      .catch(err => {
        console.error("❌ Erreur chargement des créneaux :", err);
      });
  }, [etapeVueSelectionnee, couleursProfesseurs]); // Ajout de couleursProfesseurs comme dépendance


  const regrouperCreneauxConsecutifs = (creneaux) => {
    const groupes = [];
  
    creneaux.forEach((creneau) => {
      const groupeCourant = groupes.find((groupe) =>
        groupe.professeur.id === creneau.professeur.id &&
        groupe.cours.id === creneau.cours.id &&
        groupe.groupe === creneau.groupe &&
        (groupe.modeCours?.id || '') === (creneau.modeCours?.id || '') &&
        groupe.jour === creneau.jour &&
        parseInt(groupe.heureFin) === parseInt(creneau.heureDebut)
      );
  
      if (groupeCourant) {
        groupeCourant.heureFin = creneau.heureFin;
      } else {
        groupes.push({ ...creneau });
      }
    });
  
    return groupes;
  };


  const gererChangementFiltre = (nouveauxFiltres) => {
    setFiltres({ ...filtres, ...nouveauxFiltres });
    if (nouveauxFiltres.etape) {
      setEtapeVueSelectionnee(nouveauxFiltres.etape);
    }
  };

  // Fonction pour compter les heures consécutives d'un professeur pour un cours donné
  const compterHeuresConsecutives = (creneaux, professeurId, coursId, jour, heureDebut) => {
    let heuresConsecutives = 0;
    let heure = heureDebut;
    
    while (true) {
      const creneauExistant = creneaux.find(
        creneau => 
          creneau.jour === jour && 
          parseInt(creneau.heureDebut) === heure &&
          creneau.professeur.id === professeurId &&
          creneau.cours.id === coursId
      );
      
      if (creneauExistant) {
        heuresConsecutives++;
        heure++;
      } else {
        break;
      }
    }
    
    return heuresConsecutives;
  };

  // Fonction pour compter les heures totales d'un professeur pour un cours et un groupe donnés par semaine
  const compterHeuresParSemaine = (creneaux, professeurId, coursId, groupe) => {
    return creneaux.filter(
      creneau => 
        creneau.professeur.id === professeurId &&
        creneau.cours.id === coursId &&
        creneau.groupe === groupe
    ).length;
  };

  const estCreneauDisponible = (jour, heure, heuresConsecutives = 1) => {
    for (let i = 0; i < heuresConsecutives; i++) {
      // Vérification existante dans l'étape actuelle
      const creneauxEtapeActuelle = creneauxParEtape[etapeVueSelectionnee?.id] || [];

      const creneauxConflictuels = creneauxEtapeActuelle.filter(creneau =>
          creneau.jour === jour &&
          parseInt(creneau.heureDebut) === (heure + i) &&
          creneau.cours.code === filtres.cours?.code
      );

      if (creneauxConflictuels.length >= 2 ||
          creneauxConflictuels.some(creneau => creneau.modeCours.id === filtres.modeCours?.id)) {
        return { disponible: false, raison: "Ce créneau est déjà occupé par ce cours." };
      }

      // Vérification du groupe occupé
      const groupeOccupe = creneauxEtapeActuelle.some(creneau =>
        creneau.jour === jour &&
        parseInt(creneau.heureDebut) === (heure + i) &&
        creneau.groupe === filtres.groupe
      );
      if (groupeOccupe) {
        return { disponible: false, raison: "Ce groupe d'étudiants est déjà en cours à ce moment-là." };
      }
  
      // Professeur déjà occupé (toutes étapes)
      const professeurOccupeGlobalement = Object.values(creneauxParEtape).some(creneauxEtape =>
        creneauxEtape.some(creneau =>
          creneau.jour === jour &&
          parseInt(creneau.heureDebut) === (heure + i) &&
          creneau.professeur.id === filtres.professeur?.id
        )
      );
      if (professeurOccupeGlobalement) {
        return { disponible: false, raison: "Ce professeur a déjà un cours à ce moment-là." };
      }
  
      // Heures autorisées
      if (heure + i >= 22) {
        return { disponible: false, raison: "L'horaire dépasse la limite autorisée (22h00)." };
      }

      // Vérification des heures consécutives (max 3h)
      if (filtres.professeur && filtres.cours) {
        const creneauxEtapeActuelle = creneauxParEtape[etapeVueSelectionnee?.id] || [];
        const heuresConsecutivesExistantes = compterHeuresConsecutives(
          creneauxEtapeActuelle, 
          filtres.professeur.id, 
          filtres.cours.id, 
          jour, 
          heure - 1
        );
        
        if (heuresConsecutivesExistantes + heuresConsecutives > 3) {
          return { disponible: false, raison: "Un professeur ne peut pas donner plus de 3 heures consécutives du même cours." };
        }
      }

      // Vérification des heures totales par semaine (max 3h)
      if (filtres.professeur && filtres.cours && filtres.groupe) {
        const creneauxEtapeActuelle = creneauxParEtape[etapeVueSelectionnee?.id] || [];
        const heuresParSemaine = compterHeuresParSemaine(
          creneauxEtapeActuelle, 
          filtres.professeur.id, 
          filtres.cours.id, 
          filtres.groupe
        );
        
        if (heuresParSemaine + heuresConsecutives > 3) {
          return { disponible: false, raison: "Un professeur ne peut pas donner plus de 3 heures par semaine du même cours au même groupe." };
        }
      }
    }
  
    return { disponible: true };
  };


  const tousLesFiltresSelectionnes = () => {
    return filtres.professeur && filtres.cours && filtres.groupe && filtres.modeCours && filtres.etape && filtres.duree;
  };

  const creerCreneauxConsecutifs = (jour, heureDebut, heuresConsecutives, professeur) => {
    const nouveauxCreneaux = [];
    const couleurProf = couleursProfesseurs[professeur.id] || couleursProfesseurs['default'];
    
    for (let i = 0; i < heuresConsecutives; i++) {
      nouveauxCreneaux.push({
        id: `${jour}-${heureDebut + i}-${professeur.id}-${Date.now()}`,
        jour,
        heureDebut: `${heureDebut + i}:00`,
        heureFin: `${heureDebut + i + 1}:00`,
        professeur,
        cours: filtres.cours,
        groupe: filtres.groupe,
        modeCours: filtres.modeCours,
        etape: filtres.etape,
        etapeId: filtres.etape.id,
        couleur: couleurProf
      });
    }
    return nouveauxCreneaux;
  };

  const reinitialiserFiltres = () => {
    setFiltres({
      professeur: null,
      cours: null,
      groupe: null,
      modeCours: null,
      etape: null,
      duree: null
    });
    setCreneauSurvole(null);
    setRaisonIndisponibilite(null);
  };


  const gererClicCreneau = (jour, heure) => {
    if (!estAuthentifie) {
      alert('Vous devez être authentifié en tant qu\'administrateur pour créer un horaire.');
      return;
    }

    if (!tousLesFiltresSelectionnes()) {
      alert('Veuillez sélectionner tous les critères avant d\'attribuer une disponibilité');
      return;
    }

    if (!etapeVueSelectionnee) {
      alert('Veuillez sélectionner une étape pour l\'affichage');
      return;
    }

    const heuresConsecutives = filtres.duree?.id || 1;

    const dispo = estCreneauDisponible(jour, heure, heuresConsecutives);
    if (!dispo.disponible) {
      alert(dispo.raison || "Ce créneau n'est pas disponible.");
      return;
    }

    // Vérifier la limite de 3 heures par semaine pour ce professeur, ce cours et ce groupe
    if (!validerLimiteCoursProfesseur(
      creneauxParEtape,
      etapeVueSelectionnee,
      filtres.professeur,
      filtres.cours,
      filtres.groupe,
      jour,
      heure,
      heuresConsecutives
    )) {
      alert('Un professeur ne peut pas donner le même cours plus de 3 heures par semaine au même groupe.');
      return;
    }

    if (!validerLimiteCoursGroupe(
      creneauxParEtape,
      etapeVueSelectionnee,
      filtres.groupe,
      filtres.cours,
      heuresConsecutives
    )) {
      alert("Ce groupe fait déjà 3 heures pour ce cours cette semaine.");
      return;
    }
    
    if (!respecteLimiteHeuresCoursProfesseurGroupe(
      creneauxParEtape,
      etapeVueSelectionnee,
      filtres.professeur.id,
      filtres.groupe,
      filtres.cours.id || filtres.cours._id,
      heuresConsecutives
    )) {
      alert('Un professeur ne peut pas donner le même cours plus de 3 heures par semaine au même groupe.');
      return;
    }

    const nouveauxCreneaux = creerCreneauxConsecutifs(jour, heure, heuresConsecutives, filtres.professeur);

    nouveauxCreneaux.forEach(creneau => {
      fetch('http://localhost:5000/api/creneaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jour: creneau.jour,
          heureDebut: creneau.heureDebut.replace(':00', ''),
          heureFin: creneau.heureFin.replace(':00', ''),
          professeur: creneau.professeur,
          cours: creneau.cours,
          groupe: creneau.groupe,
          etapeId: etapeVueSelectionnee.id,
          modeCours: creneau.modeCours || { id: '', nom: '', icone: '' }
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log("🟢 Creneau enregistré :", data);
          
          // Déclencher un événement personnalisé pour notifier les autres composants
          const event = new CustomEvent('creneauAjoute', { 
            detail: { 
              creneau: data,
              professeurId: creneau.professeur.id
            } 
          });
          window.dispatchEvent(event);
        })
        .catch(err => {
          console.error("❌ Erreur enregistrement creneau :", err);
        });
    });
    
    setCreneauxParEtape(prev => ({
      ...prev,
      [etapeVueSelectionnee.id]: [...(prev[etapeVueSelectionnee.id] || []), ...nouveauxCreneaux]
    }));

    reinitialiserFiltres();
  };

  const gererChangementEtape = (etape) => {
    setEtapeVueSelectionnee(etape);
    reinitialiserFiltres();
    setCreneauSelectionne(null);
  };

  const gererSuppressionCreneau = async (creneauId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      try {
        await fetch(`http://localhost:5000/api/creneaux/${creneauId}`, {
          method: 'DELETE',
        });
        setCreneauxParEtape(prev => {
          const creneauxMisAJour = { ...prev };
          Object.keys(creneauxMisAJour).forEach(etapeId => {
            creneauxMisAJour[etapeId] = creneauxMisAJour[etapeId].filter(creneau => creneau.id !== creneauId);
          });
          return creneauxMisAJour;
        });
        setCreneauSelectionne(null);
        
        // Déclencher un événement personnalisé pour notifier les autres composants
        const event = new CustomEvent('creneauSupprime', { 
          detail: { creneauId } 
        });
        window.dispatchEvent(event);
      } catch (err) {
        console.error("❌ Erreur suppression creneau :", err);
      }
    }
  };

  const creneauxEtapeActuelle = etapeVueSelectionnee ? (creneauxParEtape[etapeVueSelectionnee.id] || []) : [];
  const creneauxHorairesGroupes = regrouperCreneauxConsecutifs(creneauxEtapeActuelle);

  // Utiliser directement heures au lieu de filtrer avec heuresVisibles
  // pour s'assurer que toutes les heures de 8h à 22h sont affichées
  const heuresVisibles = heures;

  const estCreneauEnApercu = (jour, heure) => {
    if (!creneauSurvole || !filtres.duree) return false;
    const { jour: jourSurvole, heure: heureSurvole } = creneauSurvole;
    const nombreDuree = filtres.duree.id;
    
    return jour === jourSurvole && 
           heure >= heureSurvole && 
           heure < (heureSurvole + nombreDuree);
  };

  const obtenirCouleurFondCreneau = (jour, heure, estDisponible, peutSelectionner, estApercu) => {
    const creneauExistant = creneauxEtapeActuelle.find(
      creneau => creneau.jour === jour && parseInt(creneau.heureDebut) === heure
    );

    if (creneauExistant) {
      return creneauExistant.couleur?.bg || 'bg-gray-100';
    }

    if (estApercu && filtres.professeur) {
      return couleursProfesseurs[filtres.professeur.id]?.bg || 'bg-gray-100';
    }

    if (!peutSelectionner && tousLesFiltresSelectionnes()) {
      return 'bg-gray-300'; // Gris plus foncé pour les créneaux indisponibles
    }

    if (!peutSelectionner) {
      return 'bg-gray-50';
    }

    return '';
  };

  const supprimerPlageReservation = async (creneau) => {
    if (confirm('Supprimer toute la plage horaire de cette réservation ?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/creneaux/supprimer-plage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jour: creneau.jour,
            professeurId: creneau.professeur.id,
            coursId: creneau.cours.id,
            groupe: creneau.groupe,
            etapeId: creneau.etapeId
          })
        });
  
        const deleted = await res.json();
        console.log('🗑️ Supprimés :', deleted);
  
        // Mise à jour côté client
        setCreneauxParEtape(prev => {
          const maj = { ...prev };
          maj[etapeVueSelectionnee.id] = (maj[etapeVueSelectionnee.id] || []).filter(
            c =>
              !(
                c.jour === creneau.jour &&
                c.professeur.id === creneau.professeur.id &&
                c.cours.id === creneau.cours.id &&
                c.groupe === creneau.groupe &&
                c.etapeId === creneau.etapeId
              )
          );
          return maj;
        });
  
        setCreneauSelectionne(null);
        
        // Déclencher un événement personnalisé pour notifier les autres composants
        const event = new CustomEvent('plageSupprimee', { 
          detail: { 
            jour: creneau.jour,
            professeurId: creneau.professeur.id,
            coursId: creneau.cours.id,
            groupe: creneau.groupe,
            etapeId: creneau.etapeId
          } 
        });
        window.dispatchEvent(event);
        
        alert('Plage supprimée avec succès ✅');
      } catch (err) {
        console.error("❌ Erreur suppression plage horaire :", err);
        alert('Erreur lors de la suppression de la plage horaire');
      }
    }
  };
  
  const rendreCreneauxHoraires = (jour, heure) => {
    const creneaux = creneauxHorairesGroupes.filter(
      creneau => creneau.jour === jour && parseInt(creneau.heureDebut) === heure
    );

    if (creneaux.length === 0) return null;

    if (creneaux.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 h-full">
          {creneaux.map((creneau) => (
            <CreneauHoraire
              key={creneau.id}
              heureDebut={creneau.heureDebut}
              heureFin={creneau.heureFin}
              professeur={creneau.professeur}
              cours={creneau.cours}
              groupe={creneau.groupe}
              modeCours={creneau.modeCours}
              consecutifs={creneau.consecutifs}
              couleur={creneau.couleur || couleursProfesseurs['default']}
              onSupprimer={() => gererSuppressionCreneau(creneau.id)}
              onClick={() => setCreneauSelectionne(creneau)}
            />
          ))}
        </div>
      );
    }

    return creneaux.map((creneau) => (
      <CreneauHoraire
        key={creneau.id}
        heureDebut={creneau.heureDebut}
        heureFin={creneau.heureFin}
        professeur={creneau.professeur}
        cours={creneau.cours}
        groupe={creneau.groupe}
        modeCours={creneau.modeCours}
        consecutifs={creneau.consecutifs}
        couleur={creneau.couleur || couleursProfesseurs['default']}
        onSupprimer={() => gererSuppressionCreneau(creneau.id)}
        onClick={() => setCreneauSelectionne(creneau)}
      />
    ));
  };

  const gererSurvolCreneau = (jour, heure) => {
    if (!tousLesFiltresSelectionnes()) return;
    
    const heuresConsecutives = filtres.duree?.id || 1;
    const dispo = estCreneauDisponible(jour, heure, heuresConsecutives);
    
    if (!dispo.disponible) {
      setRaisonIndisponibilite({ jour, heure, raison: dispo.raison });
    } else {
      setRaisonIndisponibilite(null);
    }
    
    setCreneauSurvole({ jour, heure });
  };

  const gererFinSurvolCreneau = () => {
    setCreneauSurvole(null);
    setRaisonIndisponibilite(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-none p-6">
        <EnTeteCalendrier onChangementFiltre={gererChangementFiltre} filtres={filtres} />
        <SelecteurEtape
          etapeSelectionnee={etapeVueSelectionnee}
          onChangementEtape={gererChangementEtape}
          programmeId={filtres.programme?._id}
        />
        
        {!etapeVueSelectionnee && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Veuillez sélectionner une étape pour afficher ou modifier l'emploi du temps correspondant.
            </p>
          </div>
        )}
        
        {etapeVueSelectionnee && !tousLesFiltresSelectionnes() && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Veuillez sélectionner tous les critères (Code Professeur, Code Cours, Groupe, Mode d'enseignement, Étapes, Durée) avant d'attribuer une disponibilité.
            </p>
          </div>
        )}

{creneauSelectionne && (
  <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    {/* En-tête du détail */}
    <div className="flex items-center justify-between px-2 py-1 border-b bg-gray-50">
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${creneauSelectionne.couleur?.badge || 'bg-gray-500'}`} />
        <h3 className="text-xs font-medium text-gray-700">Détails de la réservation</h3>
      </div>
      <button
        onClick={() => setCreneauSelectionne(null)}
        className="text-gray-400 hover:text-gray-500"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
    {/* Contenu du détail */}
    <div className="p-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Exemple d'information sur le professeur */}
        <div>
          <div className="flex items-center mb-1">
            <Users className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-xs font-medium text-gray-700">Professeur</span>
          </div>
          <p className="text-xs text-gray-600">{creneauSelectionne.professeur.nom}</p>
        </div>
        {/* Exemple d'information sur le cours */}
        <div>
          <div className="flex items-center mb-1">
            <BookOpen className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-xs font-medium text-gray-700">Cours</span>
          </div>
          <p className="text-xs text-gray-600">
            {creneauSelectionne.cours.code} - {creneauSelectionne.cours.nom}
          </p>
        </div>
        {/* Ajoutez ici d'autres informations de réservation si nécessaire */}
      </div>
      {/* Bouton pour supprimer toute la plage si plusieurs créneaux consécutifs */}
      {true && (
  <div className="mt-2">
    <button
      onClick={() => supprimerPlageReservation(creneauSelectionne)}
      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
    >
      Supprimer toute la plage
    </button>
  </div>
)}

    </div>
  </div>
)}

      </div>

      <div className="flex-1 overflow-auto p-6 pt-0 flex">
        {/* Statistiques Globales */}
        <StatistiquesProfesseur creneauxParEtape={creneauxParEtape} />
        
        <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm">
          <div className="sticky top-0 z-10 grid grid-cols-6 border-b bg-white">
            <div className="p-2 text-center font-medium text-gray-500 bg-gray-50 border-r"></div>
            {joursDelaSemaine.map((jour) => (
              <div key={jour} className="p-2 text-center font-medium text-gray-700 bg-gray-50 border-r last:border-r-0">
                {jour}
              </div>
            ))}
          </div>

          <div className="min-h-[1200px]"> {/* Hauteur minimale pour assurer que tous les créneaux sont visibles */}
            {heuresVisibles.map((heure) => (
              <div key={heure} className="grid grid-cols-6 border-b last:border-b-0">
                <div className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50 border-r">
                  {heure}:00
                </div>
                {joursDelaSemaine.map((jour) => {
                  const dispo = estCreneauDisponible(jour, heure, filtres.duree?.id || 1);
                  const estDisponible = dispo.disponible;
                  const peutSelectionner = tousLesFiltresSelectionnes() && estDisponible;
                  const estApercu = estCreneauEnApercu(jour, heure);
                  const couleurFond = obtenirCouleurFondCreneau(jour, heure, estDisponible, peutSelectionner, estApercu);
                  const estIndisponible = tousLesFiltresSelectionnes() && !estDisponible;
                  const afficherRaison = raisonIndisponibilite && 
                                        raisonIndisponibilite.jour === jour && 
                                        raisonIndisponibilite.heure === heure;
                  
                  return (
                    <div
                      key={`${jour}-${heure}`}
                      className={`relative border-r last:border-r-0 min-h-[60px] ${couleurFond} ${
                        peutSelectionner ? 'cursor-pointer hover:bg-gray-100' : 
                        estIndisponible ? 'cursor-not-allowed' : ''
                      }`}
                      onClick={() => peutSelectionner && gererClicCreneau(jour, heure)}
                      onMouseEnter={() => gererSurvolCreneau(jour, heure)}
                      onMouseLeave={gererFinSurvolCreneau}
                    >
                      {rendreCreneauxHoraires(jour, heure)}
                      
                      {/* Indicateur visuel pour créneaux indisponibles */}
                      {estIndisponible && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-red-500 opacity-50" />
                        </div>
                      )}
                      
                      {/* Tooltip pour afficher la raison d'indisponibilité */}
                      {afficherRaison && (
                        <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                          {raisonIndisponibilite.raison}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                      
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;
