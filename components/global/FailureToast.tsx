import React, { useState, useEffect } from 'react';

interface SuccessToastProps {
  message: string;
  visible: boolean;
  duration?: number; // duration in milliseconds
  onClose: () => void;
}

const FailureToast: React.FC<SuccessToastProps> = ({ message, visible, duration = 3000, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 mx-auto bg-red-500 text-white py-2 px-4 rounded shadow-lg flex items-center gap-5 z-50">
      <i className="ri-close-circle-fill text-white text-2xl"></i>
      <span className='font-avenir-arabic font-bolder text-white'>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 bg-transparent text-white"
      >
        <i className="ri-close-large-fill text-white text-2xl"></i>
      </button>
    </div>
  );
};

export default FailureToast;
