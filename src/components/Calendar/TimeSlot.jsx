import React from 'react';

const TimeSlot = ({ startTime, endTime, professor, course, courseMode, consecutive, color }) => {
  return (
    <div
      className={`rounded-lg p-2 mb-1 ${color.bg} transition-transform hover:scale-[1.02]`}
      style={{ 
        height: consecutive > 1 ? `${consecutive * 5}rem` : 'auto',
        maxHeight: '100%'
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
    </div>
  );
};

export default TimeSlot;