import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { professors, courses, steps, courseModes } from '../../data/mockData';

const Dropdown = ({ label, options, value, onChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-left flex justify-between items-center ${
          value ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
        }`}
      >
        <span className={`${value ? 'text-emerald-700' : 'text-gray-700'}`}>
          {value || label}
        </span>
        <ChevronDown className={`w-5 h-5 ${value ? 'text-emerald-400' : 'text-gray-400'}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.id || option.code}
              className="px-4 py-2 hover:bg-emerald-50 cursor-pointer"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.code ? `${option.code} - ${option.name}` : option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CalendarHeader = ({ onFilterChange, filters }) => {
  const tokens = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: `${i + 1} heure${i > 0 ? 's' : ''}`
  }));

  const handleProfessorChange = (prof) => {
    onFilterChange?.({ professor: prof });
  };

  const handleCourseChange = (course) => {
    onFilterChange?.({ course });
  };

  const handleCourseModeChange = (mode) => {
    onFilterChange?.({ courseMode: mode });
  };

  const handleStepChange = (step) => {
    onFilterChange?.({ step });
  };

  const handleTokenChange = (token) => {
    onFilterChange?.({ token });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-5 gap-4">
        <Dropdown
          label="Code Professeur"
          options={professors}
          value={filters?.professor ? `${filters.professor.code} - ${filters.professor.name}` : ''}
          onChange={handleProfessorChange}
        />
        <Dropdown
          label="Code Cours"
          options={courses}
          value={filters?.course ? `${filters.course.code} - ${filters.course.name}` : ''}
          onChange={handleCourseChange}
        />
        <Dropdown
          label="Mode d'enseignement"
          options={courseModes}
          value={filters?.courseMode ? `${filters.courseMode.icon} ${filters.courseMode.name}` : ''}
          onChange={handleCourseModeChange}
        />
        <Dropdown
          label="Étapes"
          options={steps}
          value={filters?.step?.name || ''}
          onChange={handleStepChange}
        />
        <Dropdown
          label="Token shift"
          options={tokens}
          value={filters?.token?.name || ''}
          onChange={handleTokenChange}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;