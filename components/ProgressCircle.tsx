import React from 'react';

interface ProgressCircleProps {
  stepNumber: number;
  title: string;
  isComplete: boolean;
  isCurrentStep: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ stepNumber, title, isComplete, isCurrentStep }) => {
  return (
    <div className="flex flex-row items-center gap-2 lg:mb-4 mb-0">
      {isComplete ? (
        <div className='w-6 h-6 flex items-center justify-center rounded-full text-white font-semibold bg-dark-blue'>
          <i className='ri-check-line text-border-lighter-blue text-lg'></i>
        </div>
      ) : (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-dark-blue font-avenir-arabic font-bold text-sm ${isComplete ? 'bg-dark-blue' : 'bg-light-blue'} ${isComplete ? 'text-light-blue' : 'text-dark-blue'}`}
        >
          {stepNumber}
        </div>
      )}
      <div
        className={`${isCurrentStep ? 'block' : 'hidden'
          } ${isCurrentStep ? 'text-dark-blue font-bold' : isComplete ? 'text-dark-blue' : 'text-light-blue'} sm:hidden lg:block text-sm text-center font-avenir-arabic font-bold`}
      >
        {title}
      </div>
    </div>
  );
};

export default ProgressCircle;
