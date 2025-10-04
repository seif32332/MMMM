import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const baseClasses = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out';
  const visibilityClasses = isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 rtl:-translate-x-full';
  
  const typeClasses = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    info: 'bg-blue-50 text-blue-800',
  };
  
  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1 pt-0.5 rtl:ml-0 rtl:mr-3">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex rtl:ml-0 rtl:mr-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-500 hover:bg-transparent"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
