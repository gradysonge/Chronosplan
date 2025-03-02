import React, { useState } from 'react';
import "./accueil.scss"
import { Calendar } from 'lucide-react';
import {Link} from 'react-router-dom'
import CalendarHeader from '../Calendar/CalendarHeader';




const Accueil = () =>{

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedEtape, setSelectedEtape] = useState("");
    const [selectedAnnee, setSelectedAnnee] = useState("");

    const coursSelonProgramme = [
        {id: 1, name : "Programmation distribuee", annee: 2, etape: 1, category: "Génie informatique" }, 
        {id: 2, name : "Pyhton", annee: 1,  etape: 1, category: "Programmation" }, 
        {id: 3, name : "Programmation C# C", annee: 1, etape: 2, category: "Programmation" }, 
        {id: 4, name : "Structure des donnees", annee: 1, etape: 2, category: "Programmation" }, 
        {id: 5, name : "Algorithme", annee: 1, etape: 1, category: "Programmation" }, 
        {id: 6, name : "Base de donnees massive", annee: 1, etape: 1, category: "Génie informatique" }, 
        {id: 7, name : "Electronique", annee: 1, etape: 1, category: "Génie informatique" }, 
        {id: 8, name : "Projet d'integration", annee: 1, etape: 1, category: "Génie informatique" }, 
        {id: 9, name : "Introduction a l'intelligence artificielle", annee: 1, etape: 2, category: "Génie informatique" }, 
        {id: 10, name : "Base de donnees", annee: 2, etape: 2, category: "Génie informatique" }, 
    ];
    const categoriesSelected = [...new Set(coursSelonProgramme.map(item => item.category))]

    const etapeSelected = [...new Set(coursSelonProgramme.map(item => item.etape))]

    const filteredData = selectedCategory && selectedEtape && selectedAnnee ? coursSelonProgramme.filter(item => (item.category === selectedCategory && item.etape === selectedEtape && item.annee === selectedAnnee )): [];

    const firstItem = filteredData.length > 0 ? filteredData[0] : null;



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
                

            </div>
            <div className='block_2'>
   
            </div>
        </div>
    </div>
)
} 
export default Accueil;

/*
{firstItem &&(
                    <div>
                        <h3>{firstItem.name}</h3>
                        <p>Etape : {firstItem.etape}</p>
                    </div>
                )}
*/