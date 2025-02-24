import React from 'react';
import { Clock, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';


const ProfessorStats = ({ slotsByStep }) => {
  const calculateGlobalStats = () => {
    const stats = {};

    Object.values(slotsByStep).forEach(stepSlots => {
      stepSlots.forEach(slot => {
        const profId = slot.professor.id;
        if (!stats[profId]) {
          stats[profId] = {
            professor: slot.professor,
            totalHours: 0,
            onlineHours: 0,
            inPersonHours: 0,
            slotsByStep: {}
          };
        }
//=================================================
        if (!stats[profId].slotsByStep[slot.step.id]) {
          stats[profId].slotsByStep[slot.step.id] = {
            step: slot.step,
            slots: []
          };
        }
        stats[profId].slotsByStep[slot.step.id].slots.push(slot);

        stats[profId].totalHours += 1;
        if (slot.courseMode.id === 'online') {
          stats[profId].onlineHours += 1;
        } else {
          stats[profId].inPersonHours += 1;
        }
      });
    });

    return Object.values(stats).sort((a, b) => b.totalHours - a.totalHours);
  };

  const stats = calculateGlobalStats();
  const totalProfessors = stats.length;
  const totalHours = stats.reduce((sum, stat) => sum + stat.totalHours, 0);

  const handleExport = (professorStats) => {
    const { professor, slotsByStep } = professorStats;
    
    const data = [
      ['Emploi du temps - ' + professor.name + ' (' + professor.code + ')'],
      [''],
      ['Récapitulatif des heures'],
      ['Total', professorStats.totalHours + 'h'],
      ['En ligne', professorStats.onlineHours + 'h'],
      ['Présentiel', professorStats.inPersonHours + 'h'],
      [''],
      ['Détail par étape'],
      ['']
    ];

    Object.values(slotsByStep).forEach(({ step, slots }) => {
      data.push([`Étape ${step.name}`]);
      data.push(['']);
      data.push(['Jour', 'Horaire', 'Cours', 'Mode', 'Durée']);

      const sortedSlots = [...slots].sort((a, b) => {
        const dayOrder = { 'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4, 'Vendredi': 5 };
        if (dayOrder[a.day] !== dayOrder[b.day]) {
          return dayOrder[a.day] - dayOrder[b.day];
        }
        return parseInt(a.startTime) - parseInt(b.startTime);
      });

      let currentDay = null;
      let consecutiveSlots = [];

      sortedSlots.forEach((slot, index) => {
        if (currentDay !== slot.day) {
          if (consecutiveSlots.length > 0) {
            data.push(formatConsecutiveSlots(consecutiveSlots));
            consecutiveSlots = [];
          }
          if (currentDay !== null) {
            data.push(['']);
          }
          currentDay = slot.day;
        }

        const prevSlot = consecutiveSlots[consecutiveSlots.length - 1];
        if (prevSlot && 
            prevSlot.course.code === slot.course.code && 
            prevSlot.courseMode.id === slot.courseMode.id &&
            parseInt(prevSlot.endTime) === parseInt(slot.startTime)) {
          consecutiveSlots.push(slot);
        } else {
          if (consecutiveSlots.length > 0) {
            data.push(formatConsecutiveSlots(consecutiveSlots));
            consecutiveSlots = [];
          }
          consecutiveSlots = [slot];
        }

        if (index === sortedSlots.length - 1 && consecutiveSlots.length > 0) {
          data.push(formatConsecutiveSlots(consecutiveSlots));
        }
      });

      data.push(['']);
      data.push(['']);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Emploi du temps");

    const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } };
    
    [0, 2, 7].forEach(row => {
      const cell = XLSX.utils.encode_cell({ r: row, c: 0 });
      if (ws[cell]) ws[cell].s = headerStyle;
    });

    ws['!cols'] = [
      { wch: 12 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 8 }
    ];

    XLSX.writeFile(wb, `emploi_du_temps_${professor.code}.xlsx`);
  };

  const formatConsecutiveSlots = (slots) => {
    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];
    return [
      firstSlot.day,
      `${firstSlot.startTime} - ${lastSlot.endTime}`,
      `${firstSlot.course.code} - ${firstSlot.course.name}`,
      firstSlot.courseMode.name,
      `${slots.length}h`
    ];
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-sm p-4 mr-4 h-full overflow-hidden flex flex-col">
      <div className="flex-none mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Statistiques Globales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="text-emerald-600 text-2xl font-bold">{totalProfessors}</div>
            <div className="text-sm text-emerald-700">Professeurs actifs</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-blue-600 text-2xl font-bold">{totalHours}</div>
            <div className="text-sm text-blue-700">Heures totales</div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full flex flex-col">
          <h4 className="flex-none font-medium text-gray-700 bg-white py-2 sticky top-0 z-10">
            Détails par professeur
          </h4>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.professor.id}
                className="bg-gray-50 rounded-lg p-3 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={stat.professor.avatar}
                      alt={stat.professor.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{stat.professor.name}</div>
                      <div className="text-xs text-gray-500">{stat.professor.code}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleExport(stat)}
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Exporter l'emploi du temps"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between bg-white rounded p-2">
                    <span className="text-gray-600">En ligne</span>
                    <span className="font-medium text-blue-600">{stat.onlineHours}h</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded p-2">
                    <span className="text-gray-600">Présentiel</span>
                    <span className="font-medium text-emerald-600">{stat.inPersonHours}h</span>
                  </div>
                </div>
              </div>
            ))}
            
            {stats.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                Aucune réservation pour le moment
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorStats;