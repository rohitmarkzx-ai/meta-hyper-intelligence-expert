
import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center p-6 bg-gray-800/30 rounded-lg">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-gray-300 font-medium animate-pulse">{message}</p>
    </div>
  );
};
