
import React from 'react';

interface OnboardingStepperProps {
  currentStep: number;
  steps: string[];
}

const CheckmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                index + 1 <= currentStep ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              {index + 1 < currentStep ? <CheckmarkIcon /> : index + 1}
            </div>
            <p className={`mt-2 text-xs text-center ${index + 1 <= currentStep ? 'text-primary' : 'text-gray-500'}`}>
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-auto border-t-2 mx-2 ${
                index + 1 < currentStep ? 'border-primary' : 'border-gray-300'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};