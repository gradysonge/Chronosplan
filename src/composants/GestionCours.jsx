import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, BookOpen, GraduationCap, Clock, Search } from 'lucide-react';

const GestionCours = () => {
  const [programmes, setProgrammes] = useState([]);
  const [cours, setCours] = useState([]);
  const [programmeEtendu, setProgrammeEtendu] = useState(null);
  const [ajoutProgramme, setAjoutProgramme] = useState(false);
  const [ajoutCours, setAjoutCours] = useState(false);
  const [programmeSelectionne, setProgrammeSelectionne] = useState(null);
  const [etapeSelectionnee, setEtapeSelectionnee] = useState(null);
  const [programmeEnEdition, setProgrammeEnEdition] = useState(null);
  const [coursEnEdition, setCoursEnEdition] = useState(null);
  const [nouveauNomProgramme, setNouveauNomProgramme] = useState('');
  const [nombreEtapes, setNombreEtapes] = useState(1);
  const [rechercheQuery, setRechercheQuery] = useState('');
  const [nouveauCours, setNouveauCours] = useState({
    code: '',
    nom: '',
    credits: 3
  });
  const [groupes, setGroupes] = useState([]);
  const [pageActuelle, setPageActuelle] = useState(1);
  const coursParPage = 10;

  const ajouterGroupe = () => {
    const dernierNumero = groupes.length > 0
        ? parseInt(groupes[groupes.length - 1].substring(1)) // extrait 10, 20, ...
        : 0;

    const prochainNumero = dernierNumero + 10;
    const nouveauGroupe = `G0${prochainNumero}`;
    setGroupes([...groupes, nouveauGroupe]);
  };

  const supprimerGroupe = (index) => {
    const nouveauxGroupes = [...groupes];
    nouveauxGroupes.splice(index, 1);
    setGroupes(nouveauxGroupes);
  };

  // Chargement des données initiales
  useEffect(() => {
    fetch('http://localhost:5000/api/programmes')
        .then(res => res.json())
        .then(data => setProgrammes(data))
        .catch(err => console.error('Erreur chargement programmes', err));

    fetch('http://localhost:5000/api/cours')
        .then(res => res.json())
        .then(data => setCours(data))
        .catch(err => console.error('Erreur chargement cours', err));
  }, []);

  const ajouterProgramme = () => {
    if (!nouveauNomProgramme.trim()) return;

    const etapes = Array.from({ length: nombreEtapes }, (_, index) => ({
      id: `step${Date.now()}-${index}`,
      nom: `Étape ${index + 1}`
    }));

    const payload = {
      nom: nouveauNomProgramme,
      etapes
    };


    fetch('http://localhost:5000/api/programmes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
          setProgrammes([...programmes, data]);
          setNouveauNomProgramme('');
          setNombreEtapes(1);
          setAjoutProgramme(false);
        })
        .catch(err => console.error("Erreur ajout programme", err));
  };


  const ajouterCours = () => {
    if (!nouveauCours.code.trim() || !nouveauCours.nom.trim() || !programmeSelectionne || !etapeSelectionnee) return;
  
    const payload = {
      ...nouveauCours,
      description: '',
      programmeId: programmeSelectionne,
      etapeId: etapeSelectionnee,
      groupes: groupes
    };
  
    fetch('http://localhost:5000/api/cours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setCours([...cours, data]);
        setNouveauCours({ code: '', nom: '', credits: 3 });
        setGroupes([]); // Réinitialiser les groupes après création
        setAjoutCours(false);
      })
      .catch(err => console.error("Erreur ajout cours", err));
  };
  



  const supprimerProgramme = (programmeId) => {
    if (window.confirm("Supprimer ce programme ?")) {
      fetch(`http://localhost:5000/api/programmes/${programmeId}`, {
        method: 'DELETE'
      })
          .then(() => {
            setProgrammes(programmes.filter(p => p._id !== programmeId));
            setCours(cours.filter(c => c.programmeId !== programmeId));
          })
          .catch(err => console.error("Erreur suppression programme", err));
    }
  };


  const supprimerEtape = (programmeId, etapeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette étape et tous ses cours associés?')) {
      const programmesMAJ = programmes.map(programme => {
        if (programme._id === programmeId) {
          return {
            ...programme,
            etapes: programme.etapes.filter(etape => etape.id !== etapeId)
          };
        }
        return programme;
      });

      setProgrammes(programmesMAJ);
      setCours(cours.filter(cours => cours.etapeId !== etapeId));
    }
  };

  const supprimerCours = (coursId) => {
    if (window.confirm("Supprimer ce cours ?")) {
      fetch(`http://localhost:5000/api/cours/${coursId}`, {
        method: 'DELETE'
      })
          .then(() => setCours(cours.filter(c => c._id !== coursId)))
          .catch(err => console.error("Erreur suppression cours", err));
    }
  };


  const mettreAJourProgramme = (programmeId) => {
    const programmeActuel = programmes.find(p => p._id === programmeId);
    if (!programmeActuel) return;

    const payload = {
      nom: nouveauNomProgramme,
      etapes: programmeActuel.etapes // on garde les étapes actuelles
    };

    fetch(`http://localhost:5000/api/programmes/${programmeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
          const programmesMAJ = programmes.map(p =>
              p._id === data._id ? data : p
          );
          setProgrammes(programmesMAJ);
          setProgrammeEnEdition(null);
          setNouveauNomProgramme('');
        })
        .catch(err => console.error("Erreur modification programme", err));
  };


  const mettreAJourCours = () => {
    if (!coursEnEdition || !coursEnEdition._id) return;

    const payload = {
      ...nouveauCours,
      programmeId: programmeSelectionne || coursEnEdition.programmeId,
      etapeId: etapeSelectionnee || coursEnEdition.etapeId,
      groupes,
    };

    fetch(`http://localhost:5000/api/cours/${coursEnEdition._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
          const coursMAJ = cours.map(c => (c._id === data._id ? data : c));
          setCours(coursMAJ);
          setCoursEnEdition(null);
          setNouveauCours({ code: '', nom: '', credits: 3 });
          setProgrammeSelectionne(null);
          setEtapeSelectionnee(null);
        })
        .catch(err => console.error("Erreur modification cours", err));
  };


  const commencerEditionProgramme = (programme) => {
    setProgrammeEnEdition(programme._id);
    setNouveauNomProgramme(programme.nom);
  };

  const commencerEditionCours = (cours) => {
    setCoursEnEdition(cours);
    setNouveauCours({
      code: cours.code,
      nom: cours.nom,
      credits: cours.credits
    });
    setProgrammeSelectionne(cours.programmeId);
    setEtapeSelectionnee(cours.etapeId);
    setGroupes(cours.groupes || []);
  };

  const obtenirNomEtapeParId = (etapeId) => {
    for (const programme of programmes) {
      const etape = programme.etapes.find(e => e.id === etapeId);
      if (etape) return etape.nom;
    }
    return 'Étape inconnue';
  };

  const obtenirNomProgrammeParId = (programmeId) => {
    if (!programmeId) return '...';

    // Si programmeId est déjà un objet
    if (typeof programmeId === 'object' && programmeId.nom) {
      return programmeId.nom;
    }

    // Sinon, chercher dans la liste
    const programme = programmes.find(p => p._id === programmeId);
    return programme ? programme.nom : 'Programme inconnu';
  };



  const obtenirEtapesPourProgramme = (programmeId) => {
    const programme = programmes.find(p => p._id === programmeId);
    return programme ? programme.etapes : [];
  };

  const obtenirCoursPourEtape = (etapeId) => {
    return cours.filter(cours => cours.etapeId === etapeId);
  };

  const indexDernierCours = pageActuelle * coursParPage;
  const indexPremierCours = indexDernierCours - coursParPage;

  const coursFiltres = rechercheQuery
      ? cours.filter(c =>
          c.code.toLowerCase().includes(rechercheQuery.toLowerCase()) ||
          c.nom.toLowerCase().includes(rechercheQuery.toLowerCase())
      )
      : cours;

  const coursVisibles = coursFiltres.slice(indexPremierCours, indexDernierCours);
  const totalPages = Math.ceil(coursFiltres.length / coursParPage);


  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Cours et Programmes</h1>
        <p className="text-gray-600">
          Gérez les programmes d'études, leurs étapes et les cours associés.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programmes et Étapes */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Programmes et Étapes</h2>
            <button
              onClick={() => setAjoutProgramme(true)}
              className="bg-emerald-600 text-white px-3 py-1 rounded-lg flex items-center text-sm hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter un programme
            </button>
          </div>

          {ajoutProgramme && (
            <div className="mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <h3 className="text-sm font-medium text-emerald-800 mb-2">Nouveau programme</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nom du programme</label>
                  <input
                    type="text"
                    value={nouveauNomProgramme}
                    onChange={(e) => setNouveauNomProgramme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: Licence Informatique"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre d'étapes</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={nombreEtapes}
                    onChange={(e) => setNombreEtapes(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setAjoutProgramme(false)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={ajouterProgramme}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {programmes.map((programme) => (
              <div key={programme._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
                  onClick={() => setProgrammeEtendu(programmeEtendu === programme._id ? null : programme._id)}
                >
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-emerald-600 mr-2" />
                    <div>
                      {programmeEnEdition === programme._id ? (
                        <input
                          type="text"
                          value={nouveauNomProgramme}
                          onChange={(e) => setNouveauNomProgramme(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h3 className="font-medium text-gray-800">{programme.nom}</h3>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {programmeEnEdition === programme._id ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            mettreAJourProgramme(programme._id);
                          }}
                          className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-full"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgrammeEnEdition(null);
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            commencerEditionProgramme(programme);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            supprimerProgramme(programme._id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {programmeEtendu === programme._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {programmeEtendu === programme._id && (
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Étapes du programme</h4>
                    </div>

                    {programme.etapes.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Aucune étape définie</p>
                    ) : (
                      <div className="space-y-2">
                        {programme.etapes.map((etape) => (
                          <div key={etape.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700">{etape.nom}</h5>
                              <p className="text-xs text-blue-600 mt-1">
                                {obtenirCoursPourEtape(etape.id).length} cours
                              </p>
                            </div>
                            <button
                              onClick={() => supprimerEtape(programme._id, etape.id)}
                              className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {programmes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>Aucun programme défini</p>
                <button
                  onClick={() => setAjoutProgramme(true)}
                  className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm"
                >
                  Ajouter un programme
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cours */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Cours</h2>
            <button
              onClick={() => setAjoutCours(true)}
              className="bg-emerald-600 text-white px-3 py-1 rounded-lg flex items-center text-sm hover:bg-emerald-700 transition-colors"
              disabled={programmes.length === 0}
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter un cours
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un cours par code ou nom..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={rechercheQuery}
              onChange={(e) => setRechercheQuery(e.target.value)}
            />
          </div>

          {ajoutCours && (
            <div className="mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <h3 className="text-sm font-medium text-emerald-800 mb-2">Nouveau cours</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Code du cours</label>
                    <input
                        type="text"
                        value={nouveauCours.code}
                        onChange={(e) => setNouveauCours({...nouveauCours, code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ex: INF1120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Crédits</label>
                    <input
                        type="number"
                        value={nouveauCours.credits}
                        onChange={(e) => setNouveauCours({...nouveauCours, credits: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        min="1"
                        max="10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nom du cours</label>
                  <input
                      type="text"
                      value={nouveauCours.nom}
                      onChange={(e) => setNouveauCours({...nouveauCours, nom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: Programmation I"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Programme</label>
                    <select
                        value={programmeSelectionne || ''}
                        onChange={(e) => {
                          setProgrammeSelectionne(e.target.value);
                          setEtapeSelectionnee(null);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Sélectionner un programme</option>
                      {programmes.map(programme => (
                          <option key={programme._id} value={programme._id}>{programme.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Étape</label>
                    <select
                        value={etapeSelectionnee || ''}
                        onChange={(e) => setEtapeSelectionnee(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        disabled={!programmeSelectionne}
                    >
                      <option value="">Sélectionner une étape</option>
                      {programmeSelectionne && obtenirEtapesPourProgramme(programmeSelectionne).map(etape => (
                          <option key={etape.id} value={etape.id}>{etape.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                      onClick={() => {
                        setAjoutCours(false);
                        setProgrammeSelectionne(null);
                        setEtapeSelectionnee(null);
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={() => {
                        const payload = {
                          ...nouveauCours,
                          programmeId: programmeSelectionne,
                          etapeId: etapeSelectionnee,
                          groupes,
                        };
                        ajouterCours(payload);
                      }}

                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      disabled={!programmeSelectionne || !etapeSelectionnee}
                  >
                    Ajouter
                  </button>

                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Groupes</label>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {groupes.map((groupe, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                        >
                          {groupe}
                          <button
                              type="button"
                              onClick={() => supprimerGroupe(index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                              title="Supprimer le groupe"
                          >
                            ✕
                          </button>
                        </div>
                    ))}
                  </div>

                  <button
                      type="button"
                      onClick={ajouterGroupe}
                      className="text-sm bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Ajouter un groupe
                  </button>
                </div>

              </div>
            </div>
          )}

          {coursEnEdition && (
              <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Modifier le cours</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Code du cours</label>
                      <input
                          type="text"
                          value={nouveauCours.code}
                          onChange={(e) => setNouveauCours({...nouveauCours, code: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Crédits</label>
                      <input
                          type="number"
                          value={nouveauCours.credits}
                          onChange={(e) => setNouveauCours({...nouveauCours, credits: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nom du cours</label>
                    <input
                        type="text"
                        value={nouveauCours.nom}
                        onChange={(e) => setNouveauCours({...nouveauCours, nom: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Programme</label>
                      <select
                          value={programmeSelectionne || ''}
                          onChange={(e) => {
                            setProgrammeSelectionne(e.target.value);
                            setEtapeSelectionnee(null);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner un programme</option>
                        {programmes.map(programme => (
                            <option key={programme._id} value={programme._id}>{programme.nom}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Étape</label>
                      <select
                          value={etapeSelectionnee || ''}
                          onChange={(e) => setEtapeSelectionnee(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={!programmeSelectionne}
                      >
                        <option value="">Sélectionner une étape</option>
                        {programmeSelectionne && obtenirEtapesPourProgramme(programmeSelectionne).map(etape => (
                            <option key={etape.id} value={etape.id}>{etape.nom}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                          setCoursEnEdition(null);
                          setProgrammeSelectionne(null);
                          setEtapeSelectionnee(null);
                          setNouveauCours({
                            code: '',
                            nom: '',
                            credits: 3
                          });
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                    >
                      Annuler
                    </button>
                    <button
                        onClick={mettreAJourCours}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Mettre à jour
                    </button>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupes</label>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {groupes.map((groupe, index) => (
                          <div
                              key={index}
                              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {groupe}
                            <button
                                type="button"
                                onClick={() => supprimerGroupe(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                                title="Supprimer le groupe"
                            >
                              ✕
                            </button>
                          </div>
                      ))}
                    </div>

                    <button
                        type="button"
                        onClick={ajouterGroupe}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ajouter un groupe
                    </button>
                  </div>
                </div>
              </div>
          )}

          <div className="overflow-hidden">
            {coursFiltres.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cours
                      </th>
                      <th scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programme
                      </th>
                      <th scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Étape
                      </th>
                      <th scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crédits
                      </th>
                      <th scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {coursVisibles.map((cours) => (
                        <tr key={cours._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cours.code}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div>{cours.nom}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {obtenirNomProgrammeParId(cours.programmeId)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {obtenirNomEtapeParId(cours.etapeId)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {cours.credits}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                  onClick={() => commencerEditionCours(cours)}
                                  className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4"/>
                              </button>
                              <button
                                  onClick={() => supprimerCours(cours._id)}
                                  className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                  <div className="flex justify-center mt-4 gap-2">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setPageActuelle(pageActuelle - 1)}
                        disabled={pageActuelle === 1}
                    >
                      Précédent
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 border rounded ${pageActuelle === index + 1 ? 'bg-gray-300' : ''}`}
                            onClick={() => setPageActuelle(index + 1)}
                        >
                          {index + 1}
                        </button>
                    ))}

                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setPageActuelle(pageActuelle + 1)}
                        disabled={pageActuelle === totalPages}
                    >
                      Suivant
                    </button>
                  </div>

                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
                  <p>Aucun cours trouvé</p>
                  {programmes.length > 0 ? (
                      <button
                          onClick={() => setAjoutCours(true)}
                          className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        Ajouter un cours
                      </button>
                  ) : (
                      <p className="mt-2 text-sm">Ajoutez d'abord un programme</p>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionCours;