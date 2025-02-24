import React from 'react';
import { useNavigate } from 'react-router-dom';
import { professors } from "/src/data/mockData";


const Professors = () => {
    const navigate = useNavigate();

    const handleSelectProfessor = (professor) => {
        navigate('/calendar', { state: { selectedProfessor: professor } });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Liste des Professeurs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professors.map((professor) => (
                    <div key={professor.id} className="p-4 bg-white rounded-lg shadow-sm flex flex-col items-center">
                        <img className="h-20 w-20 rounded-full mb-4" src={professor.avatar} alt={professor.name} />
                        <h2 className="text-lg font-semibold text-gray-800">{professor.name}</h2>
                        <p className="text-sm text-gray-600">{professor.title}</p>
                        <p className="text-sm text-gray-600 mb-4">{professor.department}</p>
                        <button
                            onClick={() => handleSelectProfessor(professor)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
                        >
                            Voir Disponibilités
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Professors;
