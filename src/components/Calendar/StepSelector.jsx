import React from 'react';
import { steps } from '../../data/mockData';

const StepSelector = ({ selectedStep, onStepChange }) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">Affichage par étape</h3>
        <div className="flex gap-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => onStepChange(step)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStep?.id === step.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSelector;