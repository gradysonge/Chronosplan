import React from 'react';
import { Trash2 } from 'lucide-react'; // Import de l'icône de corbeille

const TimeSlot = ({ startTime, endTime, professor, course, courseMode, consecutive, color, onDelete }) => {
  const [isHovered, setIsHovered] = React.useState(false); // État pour gérer le survol

  return (
      <div
          className={`rounded-lg p-2 mb-1 ${color.bg} transition-transform hover:scale-[1.02] relative`}
          style={{
            height: consecutive > 1 ? `${consecutive * 5}rem` : 'auto',
            maxHeight: '100%'
          }}
          onMouseEnter={() => setIsHovered(true)} // Gestion du survol
          onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-medium">
          {startTime} - {endTime}
        </span>
        {consecutive > 1 && (
          <span className={`text-xs ${color.badge} text-white px-2 py-0.5 rounded`}>
            {consecutive}h
          </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <img
                src={professor.avatar}
                alt={professor.name}
                className="w-5 h-5 rounded-full mr-1"
            />
            <span className="text-xs">{professor.name}</span>
          </div>
          <div className="text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span>{course.code}</span>
              <span className="text-gray-400">•</span>
              <span>{courseMode.icon}</span>
            </div>
          </div>
        </div>

        {/* Icône de corbeille conditionnelle */}
        {isHovered && onDelete && (
            <button
                onClick={onDelete}
                className="absolute bottom-2 right-2 p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" /> {/* Icône de corbeille */}
            </button>
        )}
      </div>
  );
};

export default TimeSlot;