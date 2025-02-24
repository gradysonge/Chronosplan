import React from 'react';
import { Trash2, Info } from 'lucide-react';

const TimeSlot = ({ startTime, endTime, professor, course, courseMode, consecutive, color, onDelete, onClick }) => {
  return (
    <div
      className={`rounded-lg p-2 mb-1 ${color.bg} transition-transform hover:scale-[1.02] group relative cursor-pointer`}
      style={{ 
        height: consecutive > 1 ? `${consecutive * 5}rem` : 'auto',
        maxHeight: '100%'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
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
      
      <div className="absolute top-1 right-1 flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded-full bg-white/0 hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Supprimer ce créneau"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default TimeSlot