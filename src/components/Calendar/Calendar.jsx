import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import TimeSlot from './TimeSlot';
import StepSelector from './StepSelector';
import ProfessorStats from './ProfessorStats';
import { professors } from '../../data/mockData';

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

const professorColors = {
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
};

const Calendar = () => {
  const [slotsByStep, setSlotsByStep] = useState({});
  const [filters, setFilters] = useState({
    professor: null,
    course: null,
    courseMode: null,
    step: null,
    token: null
  });
  const [selectedViewStep, setSelectedViewStep] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const groupConsecutiveSlots = (slots) => {
    const grouped = [];
    let currentGroup = null;

    slots.forEach((slot) => {
      if (!currentGroup ||
          currentGroup.professor.id !== slot.professor.id ||
          currentGroup.day !== slot.day ||
          parseInt(slot.startTime) !== parseInt(currentGroup.endTime)) {
        if (currentGroup) {
          grouped.push(currentGroup);
        }
        currentGroup = {
          ...slot,
          consecutive: 1,
          originalEndTime: slot.endTime
        };
      } else {
        currentGroup.consecutive++;
        currentGroup.endTime = slot.endTime;
      }
    });

    if (currentGroup) {
      grouped.push(currentGroup);
    }

    return grouped;
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    if (newFilters.step) {
      setSelectedViewStep(newFilters.step);
    }
  };

  const isSlotAvailable = (day, hour, consecutiveHours = 1) => {
    const currentStepSlots = slotsByStep[selectedViewStep?.id] || [];

    for (let i = 0; i < consecutiveHours; i++) {
      const conflictingSlots = currentStepSlots.filter(slot =>
          slot.day === day &&
          parseInt(slot.startTime) === (hour + i) &&
          slot.course.code === filters.course?.code
      );

      if (conflictingSlots.length >= 2) {
        return false;
      }

      const sameMode = conflictingSlots.find(slot => slot.courseMode.id === filters.courseMode?.id);
      if (sameMode) {
        return false;
      }

      if (hour + i >= 22) {
        return false;
      }
    }
    return true;
  };

  const areAllFiltersSelected = () => {
    return filters.professor && filters.course && filters.courseMode && filters.step && filters.token;
  };

  const createConsecutiveSlots = (day, startHour, consecutiveHours, professor) => {
    const newSlots = [];
    for (let i = 0; i < consecutiveHours; i++) {
      newSlots.push({
        id: `${day}-${startHour + i}-${professor.id}-${Date.now()}`,
        day,
        startTime: `${startHour + i}:00`,
        endTime: `${startHour + i + 1}:00`,
        professor,
        course: filters.course,
        courseMode: filters.courseMode,
        step: filters.step,
        color: professorColors[professor.id]
      });
    }
    return newSlots;
  };

  const resetFilters = () => {
    setFilters({
      professor: null,
      course: null,
      courseMode: null,
      step: null,
      token: null
    });
    setHoveredSlot(null);
  };

  const handleSlotClick = (day, hour) => {
    if (!areAllFiltersSelected()) {
      alert('Veuillez sélectionner tous les critères avant d\'attribuer une disponibilité');
      return;
    }

    if (!selectedViewStep) {
      alert('Veuillez sélectionner une étape pour l\'affichage');
      return;
    }

    const consecutiveHours = filters.token?.id || 1;

    if (!isSlotAvailable(day, hour, consecutiveHours)) {
      alert('Cette plage horaire n\'est pas disponible pour le nombre d\'heures demandé');
      return;
    }

    const newSlots = createConsecutiveSlots(day, hour, consecutiveHours, filters.professor);

    setSlotsByStep(prev => ({
      ...prev,
      [selectedViewStep.id]: [...(prev[selectedViewStep.id] || []), ...newSlots]
    }));

    resetFilters();
  };

  const handleStepChange = (step) => {
    setSelectedViewStep(step);
    resetFilters();
  };

  //===============================================================================
  const handleSlotDelete = (slotId) => {
    setSlotsByStep(prev => {
      const updatedSlots = { ...prev };

      // Supprimer le créneau spécifique
      Object.keys(updatedSlots).forEach(stepId => {
        updatedSlots[stepId] = updatedSlots[stepId].filter(slot => slot.id !== slotId);
      });

      return updatedSlots;
    });
  };
  //==========================================================================

  const currentStepSlots = selectedViewStep ? (slotsByStep[selectedViewStep.id] || []) : [];
  const groupedTimeSlots = groupConsecutiveSlots(currentStepSlots);

  const visibleHours = filters.token
      ? hours.filter(hour => {
        const consecutiveHours = filters.token.id;
        return hour + consecutiveHours <= 22;
      })
      : hours;

  const isSlotInPreview = (day, hour) => {
    if (!hoveredSlot || !filters.token) return false;
    const { day: hoverDay, hour: hoverHour } = hoveredSlot;
    const tokenCount = filters.token.id;

    return day === hoverDay &&
        hour >= hoverHour &&
        hour < (hoverHour + tokenCount);
  };

  const getSlotBackgroundColor = (day, hour, isAvailable, canSelect, isPreview) => {
    const existingSlot = currentStepSlots.find(
        slot => slot.day === day && parseInt(slot.startTime) === hour
    );

    if (existingSlot) {
      return existingSlot.color.bg;
    }

    if (isPreview && filters.professor) {
      return professorColors[filters.professor.id].bg;
    }

    if (!canSelect) {
      return 'bg-gray-50';
    }

    return '';
  };

  const renderTimeSlots = (day, hour) => {
    const slots = groupedTimeSlots.filter(
        slot => slot.day === day && parseInt(slot.startTime) === hour
    );

    if (slots.length === 0) return null;

    if (slots.length === 2) {
      return (
          <div className="grid grid-cols-2 gap-1 h-full">
            {slots.map((slot) => (
                <TimeSlot
                    key={slot.id}
                    startTime={slot.startTime}
                    endTime={slot.endTime}
                    professor={slot.professor}
                    course={slot.course}
                    courseMode={slot.courseMode}
                    consecutive={slot.consecutive}
                    color={slot.color}
                    onDelete={() => handleSlotDelete(slot.id)} // Passer la fonction de suppression
                />
            ))}
          </div>
      );
    }

    return slots.map((slot) => (
        <TimeSlot
            key={slot.id}
            startTime={slot.startTime}
            endTime={slot.endTime}
            professor={slot.professor}
            course={slot.course}
            courseMode={slot.courseMode}
            consecutive={slot.consecutive}
            color={slot.color}
            onDelete={() => handleSlotDelete(slot.id)} // Passer la fonction de suppression
        />
    ));
  };

  return (

    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-none p-6">
        <CalendarHeader onFilterChange={handleFilterChange} filters={filters} />
        <StepSelector
          selectedStep={selectedViewStep}
          onStepChange={handleStepChange}
        />
        
        {!selectedViewStep && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Veuillez sélectionner une étape pour afficher ou modifier l'emploi du temps correspondant.
            </p>
          </div>
        )}
        
        {selectedViewStep && !areAllFiltersSelected() && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Veuillez sélectionner tous les critères (Code Professeur, Code Cours, Mode d'enseignement, Étapes, Token shift) avant d'attribuer une disponibilité.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="flex h-full">
          <ProfessorStats slotsByStep={slotsByStep} />
          
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-auto">
            <div className="sticky top-0 z-10 bg-white grid grid-cols-5 border-b">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="px-4 py-3 text-center font-semibold text-gray-700 border-r last:border-r-0"
                >
                  {day}
                </div>

              ))}
            </div>

            <div className="grid grid-cols-5">
              {daysOfWeek.map((day) => (

                <div key={day} className="border-r last:border-r-0">
                  {visibleHours.map((hour) => {
                    const consecutiveHours = filters.token?.id || 1;
                    const isAvailable = isSlotAvailable(day, hour, consecutiveHours);
                    const canSelect = selectedViewStep && areAllFiltersSelected() && isAvailable;
                    const isPreview = isSlotInPreview(day, hour);
                    const backgroundColor = getSlotBackgroundColor(day, hour, isAvailable, canSelect, isPreview);

                    return (
                      <div
                        key={hour}
                        className={`h-24 border-b last:border-b-0 p-2 transition-colors duration-150 ${
                          canSelect ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                        } ${backgroundColor} ${
                          isPreview && filters.professor
                            ? `border-2 border-${professorColors[filters.professor.id].badge.replace('bg-', '')}`
                            : ''
                        }`}
                        onClick={() => handleSlotClick(day, hour)}
                        onMouseEnter={() => canSelect && setHoveredSlot({ day, hour })}
                        onMouseLeave={() => setHoveredSlot(null)}
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {`${hour}:00`}
                        </div>
                        {renderTimeSlots(day, hour)}
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

export default Calendar;