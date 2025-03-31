import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Search, Mail, Calendar, Clock, FileSpreadsheet } from 'lucide-react';


const GestionProfesseurs = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [rechercheQuery, setRechercheQuery] = useState('');
  const [ajoutProfesseur, setAjoutProfesseur] = useState(false);
  const [professeurEnEdition, setProfesseurEnEdition] = useState(null);
  const [professeurSelectionne, setProfesseurSelectionne] = useState(null);
  const [nouveauProfesseur, setNouveauProfesseur] = useState({
    code: '',
    nom: '',
    email: '',
    heuresMax: 20
  });

  // Chargement des données initiales
  useEffect(() => {
    fetch('http://localhost:5000/api/professeurs')
        .then(res => res.json())
        .then(data => {
          setProfesseurs(data);
        })
        .catch(err => console.error("Erreur chargement professeurs", err));
  }, []);


  const genererDisponibilitesAleatoires = () => {
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const disponibilites = {};
    
    jours.forEach(jour => {
      disponibilites[jour] = [];
      // Créneau du matin
      if (Math.random() > 0.3) {
        disponibilites[jour].push('8:00 - 12:00');
      }
      // Créneau de l'après-midi
      if (Math.random() > 0.3) {
        disponibilites[jour].push('13:00 - 17:00');
      }
      // Créneau du soir
      if (Math.random() > 0.7) {
        disponibilites[jour].push('18:00 - 21:00');
      }
    });
    
    return disponibilites;
  };

  const ajouterProfesseur = () => {
    if (!nouveauProfesseur.code.trim() || !nouveauProfesseur.nom.trim()) return;

    const payload = {
      ...nouveauProfesseur,

      disponibilites: {
        Lundi: ["8:00 - 12:00", "13:00 - 17:00"],
        Mardi: ["13:00 - 17:00"]
      }
    };

    fetch('http://localhost:5000/api/professeurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
          setProfesseurs([...professeurs, data]);
          setNouveauProfesseur({
            code: '',
            nom: '',
            email: '',
            heuresMax: 30
          });
          setAjoutProfesseur(false);
        })
        .catch(err => console.error("Erreur ajout professeur", err));
  };


  const mettreAJourProfesseur = () => {
    if (!professeurEnEdition || !professeurEnEdition._id) return;

    fetch(`http://localhost:5000/api/professeurs/${professeurEnEdition._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nouveauProfesseur)
    })
        .then(res => res.json())
        .then(data => {
          const professeursMAJ = professeurs.map(prof =>
              prof._id === data._id ? data : prof
          );
          setProfesseurs(professeursMAJ);
          setProfesseurEnEdition(null);
          setNouveauProfesseur({
            code: '',
            nom: '',
            email: '',
            heuresMax: 20
          });
        })
        .catch(err => console.error("Erreur mise à jour professeur", err));
  };


  const supprimerProfesseur = (professeurId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur?')) {
      fetch(`http://localhost:5000/api/professeurs/${professeurId}`, {
        method: 'DELETE'
      })
          .then(() => {
            setProfesseurs(professeurs.filter(p => p._id !== professeurId));
            if (professeurSelectionne && professeurSelectionne._id === professeurId) {
              setProfesseurSelectionne(null);
            }
          })
          .catch(err => console.error("Erreur suppression professeur", err));
    }
  };


  const commencerEditionProfesseur = (professeur) => {
    setProfesseurEnEdition(professeur);
    setNouveauProfesseur({
      code: professeur.code,
      nom: professeur.nom,
      email: professeur.email || '',
      heuresMax: professeur.heuresMax || 20
    });
  };

  const professeursFiltres = rechercheQuery
    ? professeurs.filter(professeur => 
        professeur.code.toLowerCase().includes(rechercheQuery.toLowerCase()) ||
        professeur.nom.toLowerCase().includes(rechercheQuery.toLowerCase())
      )
    : professeurs;

  const obtenirCouleurDisponibilite = (jour, creneau) => {
    if (!professeurSelectionne || !professeurSelectionne.disponibilites) return 'bg-gray-100';
    
    const estDisponible = professeurSelectionne.disponibilites[jour]?.includes(creneau);
    return estDisponible ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400';
  };

  const basculerDisponibilite = (jour, creneau) => {
    if (!professeurSelectionne) return;
    
    const professeursMAJ = professeurs.map(professeur => {
      if (professeur._id === professeurSelectionne._id) {
        const disponibilitesMAJ = { ...professeur.disponibilites };
        
        if (disponibilitesMAJ[jour]?.includes(creneau)) {
          disponibilitesMAJ[jour] = disponibilitesMAJ[jour].filter(c => c !== creneau);
        } else {
          if (!disponibilitesMAJ[jour]) {
            disponibilitesMAJ[jour] = [];
          }
          disponibilitesMAJ[jour].push(creneau);
          // Trier les créneaux chronologiquement
          disponibilitesMAJ[jour].sort();
        }
        
        return {
          ...professeur,
          disponibilites: disponibilitesMAJ
        };
      }
      return professeur;
    });
    
    setProfesseurs(professeursMAJ);
    setProfesseurSelectionne(professeursMAJ.find(p => p._id === professeurSelectionne._id));
  };

  const exporterEmploiDuTemps = () => {
    if (!professeurSelectionne) return;
    
    alert(`Exportation de l'emploi du temps pour ${professeurSelectionne.nom} (${professeurSelectionne.code})`);
    // Normalement, utiliserait la bibliothèque XLSX pour exporter l'emploi du temps mais on va faire ca apres le livrable du frontend - david ou charles 
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Professeurs</h1>
        <p className="text-gray-600">
          Gérez les informations des professeurs, leurs disponibilités et leurs charges d'enseignement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des professeurs */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Professeurs</h2>
            <button
              onClick={() => setAjoutProfesseur(true)}
              className="bg-emerald-600 text-white px-3 py-1 rounded-lg flex items-center text-sm hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter un professeur
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un professeur par code ou nom..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={rechercheQuery}
              onChange={(e) => setRechercheQuery(e.target.value)}
            />
          </div>

          {ajoutProfesseur && (
            <div className="mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <h3 className="text-sm font-medium text-emerald-800 mb-2">Nouveau professeur</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Code</label>
                    <input
                      type="text"
                      value={nouveauProfesseur.code}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: ELOS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={nouveauProfesseur.nom}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, nom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: Samir Elouasbi"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={nouveauProfesseur.email}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: elos@universite.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Heures max. par semaine</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={nouveauProfesseur.heuresMax}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, heuresMax: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setAjoutProfesseur(false)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={ajouterProfesseur}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )} {professeurEnEdition && (
            <div className="mb-4 bg-green-50 p-3 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Modifier le professeur</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Code</label>
                    <input
                      type="text"
                      value={nouveauProfesseur.code}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={nouveauProfesseur.nom}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, nom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={nouveauProfesseur.email}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Heures max. par semaine</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={nouveauProfesseur.heuresMax}
                      onChange={(e) => setNouveauProfesseur({...nouveauProfesseur, heuresMax: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setProfesseurEnEdition(null)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={mettreAJourProfesseur}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Mettre à jour
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden">
            {professeursFiltres.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professeursFiltres.map((professeur) => (
                  <div 
                    key={professeur._id}
                    className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                      professeurSelectionne?._id === professeur._id ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200'
                    }`}
                    onClick={() => setProfesseurSelectionne(professeur)}
                  >
                    <div className="flex p-4">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">{professeur.nom}</h3>
                            <p className="text-sm text-gray-500">{professeur.code}</p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                commencerEditionProfesseur(professeur);
                              }}
                              className="p-1 text-green-600 hover:bg-blue-100 rounded-full"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                supprimerProfesseur(professeur._id);
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          <span>{professeur.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>Aucun professeur trouvé</p>
                <button
                  onClick={() => setAjoutProfesseur(true)}
                  className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm"
                >
                  Ajouter un professeur
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Détails du professeur sélectionné */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {professeurSelectionne ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Détails du professeur</h2>
                <button
                  onClick={exporterEmploiDuTemps}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center text-sm"
                  title="Exporter l'emploi du temps"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" />
                  <span>Exporter</span>
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div
                    className="w-16 h-16 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-4 text-sm font-medium">
                  {professeurSelectionne.nom
                      ?.split(' ')
                      .map(mot => mot.charAt(0).toUpperCase())
                      .join('')
                  }

                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">{professeurSelectionne.nom}</h3>
                  <p className="text-gray-500">{professeurSelectionne.code}</p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3"/>
                  <div>
                    <p className="text-sm text-gray-800">{professeurSelectionne.email}</p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-800">{professeurSelectionne.heuresMax} heures</p>
                    <p className="text-xs text-gray-500">Charge maximale par semaine</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-emerald-600" />
                  Disponibilités
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  Cliquez sur les créneaux pour modifier les disponibilités
                </p>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 text-xs font-medium text-gray-700 bg-gray-50 border-b">
                    <div className="p-2 border-r">Jour</div>
                    <div className="p-2 border-r">Matin</div>
                    <div className="p-2 border-r">Après-midi</div>
                    <div className="p-2">Soir</div>
                  </div>
                  
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((jour) => (
                    <div key={jour} className="grid grid-cols-4 text-xs border-b last:border-b-0">
                      <div className="p-2 border-r font-medium bg-gray-50">{jour}</div>
                      <div 
                        className={`p-2 border-r cursor-pointer ${obtenirCouleurDisponibilite(jour, '8:00 - 12:00')}`}
                        onClick={() => basculerDisponibilite(jour, '8:00 - 12:00')}
                      >
                        8:00 - 12:00
                      </div>
                      <div 
                        className={`p-2 border-r cursor-pointer ${obtenirCouleurDisponibilite(jour, '13:00 - 17:00')}`}
                        onClick={() => basculerDisponibilite(jour, '13:00 - 17:00')}
                      >
                        13:00 - 17:00
                      </div>
                      <div 
                        className={`p-2 cursor-pointer ${obtenirCouleurDisponibilite(jour, '18:00 - 21:00')}`}
                        onClick={() => basculerDisponibilite(jour, '18:00 - 21:00')}
                      >
                        18:00 - 21:00
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Statistiques d'enseignement</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-600">Heures attribuées</span>
                    <span className="text-xs font-medium">0h / {professeurSelectionne.heuresMax}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-white rounded p-2">
                      <div className="text-xs text-gray-500">En ligne</div>
                      <div className="text-sm font-medium text-blue-600">0h</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-xs text-gray-500">Présentiel</div>
                      <div className="text-sm font-medium text-emerald-600">0h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p>Sélectionnez un professeur pour voir ses détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionProfesseurs;