import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, BookOpen, GraduationCap, Clock, Search } from 'lucide-react';
import "./accueil.scss"
import {Link} from 'react-router-dom'
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css"; // Ajoute les styles Mobiscroll
import BasicDateCalendar from './BasicDateCalendar';
import { DateCalendar } from '@mui/x-date-pickers';
import { use } from 'react';





const Accueil = () =>{
const [professeurs, setProfesseurs] = useState([])
const [programmes, setProgrammes] = useState([]);
const [cours, setCours] = useState([]);
const [rechercheQuery, setRechercheQuery] = useState('');
const [programmeSelectionne, setProgrammeSelectionne] = useState(null);
const [etapeSelectionnee, setEtapeSelectionnee] = useState(null);
const [pageActuelle, setPageActuelle] = useState(1);
const coursParPage = 10;

// Charger les programmes et les cours depuis l'API
useEffect(() => {
  fetch('http://localhost:5000/api/programmes')
    .then(res => res.json())
    .then(data => setProgrammes(data))
    .catch(err => console.error('Erreur chargement programmes', err));

  fetch('http://localhost:5000/api/cours')
    .then(res => res.json())
    .then(data => setCours(data))
    .catch(err => console.error('Erreur chargement cours', err));

    fetch('http://localhost:5000/api/professeurs')
    .then(res => res.json())
    .then(data => setProfesseurs(data))
    .catch(err => console.error("Erreur chargement professeurs", err))
}, []);


// Filtrer les cours en fonction de la recherche, du programme et de l'étape
const coursFiltres = cours.filter(c =>
  //(programmeSelectionne ? c.programmeId === programmeSelectionne : false) &&
  (etapeSelectionnee ? c.etapeId === etapeSelectionnee : false) &&
  (rechercheQuery
    ? c.code.toLowerCase().includes(rechercheQuery.toLowerCase()) ||
      c.nom.toLowerCase().includes(rechercheQuery.toLowerCase())
    : true)
);
// Cours visibles sur la page actuelle
const totalPages = Math.max(1, Math.ceil(coursFiltres.length / coursParPage));

// Calculer les indices pour la pagination
const indexDernierCours = Math.min(pageActuelle * coursParPage, coursFiltres.length);
const indexPremierCours = (pageActuelle - 1) * coursParPage;
const coursVisibles = coursFiltres.slice(indexPremierCours, indexDernierCours);

const nombreProfesseursParProgramme = professeurs.filter(prof => prof.programme==programmes.nom).length;

useEffect(() =>{
  if(pageActuelle > totalPages){
    setPageActuelle(1);
  }
}, [coursFiltres, totalPages])

return(
    
    <div className='accueil'>
        <div className='header'>
            <h1>Acceuil</h1>
            <Link to="/calendar" >
            <div className='button_log_out'>
                <img src="/logout_24.svg" alt="" />
                <p>log out</p>
            </div>
            </Link>
        </div>
        <div className='main_body'>
            <div className='block_1'>
            <h1>Liste des Cours</h1>

{/* Sélection du programme */}
<div className='Selction_niveau1'>
  <select
    onChange={(e) => setProgrammeSelectionne(e.target.value)}
    value={programmeSelectionne || ''}
  >
    <option value="">Sélectionner un programme</option>
    {programmes.map((programme) => (
      <option key={programme._id} value={programme._id}>
        {programme.nom}
      </option>
    ))}
  </select>
</div>

{/* Sélection de l'étape du programme */}
{programmeSelectionne && (
  <div className='Selction_niveau2'>
    <select
      onChange={(e) => setEtapeSelectionnee(e.target.value)}
      value={etapeSelectionnee || ''}
    >
      <option value="">Sélectionner une étape</option>
      {programmes
        .find((programme) => programme._id === programmeSelectionne)
        ?.etapes.map((etape) => (
          <option key={etape.id} value={etape.id}>
            {etape.nom}
          </option>
        ))}
    </select>
  </div>
)}

{/* Barre de recherche */}
<div className='Recherche'>
  <div className='carre'>Cours du programme</div>
  <div className='Recherche_carre'>
  <input

    type="text"
    placeholder="Rechercher..."
    value={rechercheQuery}
    onChange={(e) => setRechercheQuery(e.target.value)}
  />
  <Search />
  </div>
</div>

{/* Affichage des cours */}
{programmeSelectionne && etapeSelectionnee ?(
coursVisibles.length > 0 ?(
<div className='affichage_selection'>
  {coursVisibles.map((cours) => (
    <div key={cours._id} className="cours">
      <h3>{cours.nom}</h3>
      <p>Code: {cours.code}</p>
      <p>Crédits: {cours.credits}</p>
    </div>
  ))}
</div>
):(
  <p>
    Aucun cours trouve pour ce programme et cette etape.
  </p>
)):(
  <p>
  veillez selectionner un programme et une etape pour afficher les cours.
</p>
)}

{/* Pagination 

<div className='affiche_1_semaine'>
  <button
    disabled={pageActuelle === 1}
    onClick={() => setPageActuelle(pageActuelle - 1)}
  >
    {"<"}
  </button>
  <span>Page {pageActuelle} sur {totalPages}</span>
  <button
    disabled={pageActuelle === totalPages}
    onClick={() => setPageActuelle(pageActuelle + 1)}
  >
    {">"}
  </button>
</div>
*/}
            </div>
            <div className='block_2'>
                <div className='calendar'>
                <BasicDateCalendar/>
                </div>
                <div className="affiche_1_semaine"> 
                <button>  </button>
                <span> {programmes.find(p => p._id === programmeSelectionne)?.nom || ''} </span>
                <button>  </button>
                </div>
                
                <div className='affichage_nombreProf_nombreChreno'>
                    <div className='nombreProf'>
                        <p>Nombre total de professeur actif de l'ITAC </p>
                        <h1>{professeurs.length}</h1>
                    </div>

                    <div className='nombreChreno'>
                    <p>Nombre de professeur du programme selectionné</p>
                    <h1>{nombreProfesseursParProgramme}</h1>
                    </div>

                </div>
                <div className='option_suppression'></div>
            </div>
        </div>
    </div>
)
} 
export default Accueil;

/*
 <button> {"<"} </button>
                    <span> Lundi </span>
                    <button> {">"} </button>


<div className='Selction_niveau1'>
                    <select onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value=""> selectionnez un programme</option>
                        {categoriesSelected.map((category, index) => (
                            <option key={index} value={category} >{category}</option>
                        ))}
                    </select>
                    <select onChange={(e) => setSelectedAnnee(Number(e.target.value))}>
                        <option value=""> Selectionnez une année</option>
                        {etapeSelected.map((annee, index) => (
                            <option key={index} value={annee}> Année : {annee}</option>
                        ))}
                    </select>
                </div>
                <div className='Selction_niveau2'>
                <select onChange={(e) => setSelectedEtape(Number(e.target.value))}>
                        <option value=""> Selectionnez une etape</option>
                        {etapeSelected.map((etape, index) => (
                            <option key={index} value={etape}> Étape {etape}</option>
                        ))}
                    </select>
                </div>

                <div className='affichage_selection'>
                    {filteredData.map(item => (
                        <div className='cours'>
                            <h3>{item.name}</h3>
                            <p>Étape : {item.etape}</p>
                        </div>
                    ))}
                </div>
*/



