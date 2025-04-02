import React, { useState, useContext, useEffect } from 'react';
import EnTeteCalendrier from './EnTeteCalendrier';
import CreneauHoraire from './CreneauHoraire';
import SelecteurEtape from './SelecteurEtape';
import StatistiquesProfesseur from './StatistiquesProfesseur';
import { ContexteAuth } from '../../contexte/Authentification';
import { professeurs } from '../../donnees/donneesMock';
import { X, Clock, BookOpen, Users, Monitor, Blend, Trash2 } from 'lucide-react';
import { validerLimiteCoursProfesseur, respecteLimiteHeuresCoursProfesseurGroupe, validerLimiteCoursGroupe  } from '../../utils/Contraintes';


const joursDelaSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const heures = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

const couleursProfesseurs = {
  P1: { bg: 'bg-blue-100 hover:bg-blue-200', badge: 'bg-blue-500' },
  P2: { bg: 'bg-green-100 hover:bg-green-200', badge: 'bg-green-500' },
  P3: { bg: 'bg-purple-100 hover:bg-purple-200', badge: 'bg-purple-500' },
  P4: { bg: 'bg-orange-100 hover:bg-orange-200', badge: 'bg-orange-500' },
  P5: { bg: 'bg-pink-100 hover:bg-pink-200', badge: 'bg-pink-500' },
  P6: { bg: 'bg-yellow-100 hover:bg-yellow-200', badge: 'bg-yellow-500' },
  P7: { bg: 'bg-indigo-100 hover:bg-indigo-200', badge: 'bg-indigo-500' },
  P8: { bg: 'bg-red-100 hover:bg-red-200', badge: 'bg-red-500' },
  P9: { bg: 'bg-teal-100 hover:bg-teal-200', badge: 'bg-teal-500' },
  P10: { bg: 'bg-cyan-100 hover:bg-cyan-200', badge: 'bg-cyan-500' },
  P11: { bg: 'bg-lime-100 hover:bg-lime-200', badge: 'bg-lime-500' },
  P12: { bg: 'bg-amber-100 hover:bg-amber-200', badge: 'bg-amber-500' },
  P13: { bg: 'bg-emerald-100 hover:bg-emerald-200', badge: 'bg-emerald-500' },
  P14: { bg: 'bg-fuchsia-100 hover:bg-fuchsia-200', badge: 'bg-fuchsia-500' },
  P15: { bg: 'bg-rose-100 hover:bg-rose-200', badge: 'bg-rose-500' },
  P16: { bg: 'bg-violet-100 hover:bg-violet-200', badge: 'bg-violet-500' },
  P17: { bg: 'bg-sky-100 hover:bg-sky-200', badge: 'bg-sky-500' },
  P18: { bg: 'bg-stone-100 hover:bg-stone-200', badge: 'bg-stone-500' },
  P19: { bg: 'bg-zinc-100 hover:bg-zinc-200', badge: 'bg-zinc-500' },
  P20: { bg: 'bg-gray-100 hover:bg-gray-200', badge: 'bg-gray-500' },
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
            modeCours: c.modeCours || { id: '', nom: '', icone: '' },
            couleur: couleursProfesseurs[c.professeur.id] // Ajoutez la couleur basée sur l'ID du professeur
          }));
    
          setCreneauxParEtape(prev => ({
            ...prev,
            [etapeVueSelectionnee.id]: creneauxFormates
          }));
        })
        .catch(err => {
          console.error("❌ Erreur chargement des créneaux :", err);
        });
    }, [etapeVueSelectionnee]); // Supprimez creneauxParEtape des dépendances
  

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
        return false;
      }


      // Nouvelle vérification dans TOUTES les étapes (professeur occupé globalement)
      const groupeOccupe = creneauxEtapeActuelle.some(creneau =>
        creneau.jour === jour &&
        parseInt(creneau.heureDebut) === (heure + i) &&
        creneau.groupe === filtres.groupe
      );
      if (groupeOccupe) {
        return { disponible: false, raison: "Ce groupe d'étudiants est déjà en cours à ce moment-là." };
      }
  
      // ⚠️ Professeur déjà occupé (toutes étapes)
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
  
      // ⚠️ Heures autorisées
      if (heure + i >= 22) {
        return { disponible: false, raison: "L'horaire dépasse la limite autorisée (22h00)." };
      }
    }
  
    return { disponible: true };
  };


  const tousLesFiltresSelectionnes = () => {
    return filtres.professeur && filtres.cours && filtres.groupe && filtres.modeCours && filtres.etape && filtres.duree;
  };

  const creerCreneauxConsecutifs = (jour, heureDebut, heuresConsecutives, professeur) => {
    const nouveauxCreneaux = [];
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
        couleur: couleursProfesseurs[professeur.id]
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
      } catch (err) {
        console.error("❌ Erreur suppression creneau :", err);
      }
    }
  };

  const creneauxEtapeActuelle = etapeVueSelectionnee ? (creneauxParEtape[etapeVueSelectionnee.id] || []) : [];
  const creneauxHorairesGroupes = regrouperCreneauxConsecutifs(creneauxEtapeActuelle);

  const heuresVisibles = filtres.duree 
    ? heures.filter(heure => {
        const heuresConsecutives = filtres.duree.id;
        return heure + heuresConsecutives <= 22;
      })
    : heures;

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
      return creneauExistant.couleur.bg;
    }

    if (estApercu && filtres.professeur) {
      return couleursProfesseurs[filtres.professeur.id].bg;
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
              couleur={creneau.couleur}
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
        couleur={creneau.couleur}
        onSupprimer={() => gererSuppressionCreneau(creneau.id)}
        onClick={() => setCreneauSelectionne(creneau)}
      />
    ));
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
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${creneauSelectionne.couleur.badge}`}/>
                  <h3 className="text-sm font-medium text-gray-700">Détails de la réservation</h3>
                </div>
                <button
                    onClick={() => setCreneauSelectionne(null)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500"/>
                </button>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400"/>
                    <div className="flex items-center">
                     
                      <div>
                        <p className="text-sm font-medium text-gray-800">{creneauSelectionne.professeur.nom}</p>
                        <p className="text-xs text-gray-500">{creneauSelectionne.professeur.code}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{creneauSelectionne.cours.code}</p>
                      <p className="text-xs text-gray-500">{creneauSelectionne.cours.nom}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{creneauSelectionne.jour}</p>
                      <p className="text-xs text-gray-500">{creneauSelectionne.heureDebut} - {creneauSelectionne.heureFin}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800 flex items-center">
                        <span className="mr-1">{creneauSelectionne.modeCours.icone}</span>
                        {creneauSelectionne.modeCours.nom}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400"/>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Groupe {creneauSelectionne.groupe}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bouton poubelle aligné à droite */}
                <button
                    onClick={() => supprimerPlageReservation(creneauSelectionne)}
                    className="p-2 rounded-full hover:bg-red-100 transition"
                    title="Supprimer cette réservation"
                >
                  <Trash2 className="w-5 h-5 text-red-500"/>
                </button>
              </div>


            </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="flex h-full">
          <StatistiquesProfesseur creneauxParEtape={creneauxParEtape}/>

          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-auto">
            <div className="sticky top-0 z-10 bg-white grid grid-cols-5 border-b">
              {joursDelaSemaine.map((jour) => (
                  <div
                      key={jour}
                      className="px-4 py-3 text-center font-semibold text-gray-700 border-r last:border-r-0"
                  >
                    {jour}
                  </div>
              ))}
            </div>

            <div className="grid grid-cols-5">
              {joursDelaSemaine.map((jour) => (
                  <div key={jour} className="border-r last:border-r-0">
                    {heuresVisibles.map((heure) => {
                      const heuresConsecutives = filtres.duree?.id || 1;
                      const estDisponible = estCreneauDisponible(jour, heure, heuresConsecutives);
                      const peutSelectionner = etapeVueSelectionnee && tousLesFiltresSelectionnes() && estDisponible;
                      const estApercu = estCreneauEnApercu(jour, heure);
                      const couleurFond = obtenirCouleurFondCreneau(jour, heure, estDisponible, peutSelectionner, estApercu);

                      return (
                          <div
                              key={heure}
                              className={`h-24 border-b last:border-b-0 p-2 transition-colors duration-150 ${
                                  peutSelectionner ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                              } ${couleurFond} ${
                                  estApercu && filtres.professeur
                                      ? `border-2 border-${couleursProfesseurs[filtres.professeur.id].badge.replace('bg-', '')}`
                                      : ''
                              }`}
                              onClick={() => gererClicCreneau(jour, heure)}
                              onMouseEnter={() => peutSelectionner && setCreneauSurvole({jour, heure})}
                              onMouseLeave={() => setCreneauSurvole(null)}
                          >
                          <div className="text-xs text-gray-500 mb-1">
                          {`${heure}:00`}
                        </div>
                        {rendreCreneauxHoraires(jour, heure)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;