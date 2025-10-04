
import React from 'react';
import { useI18n } from '../i18n';

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const { t } = useI18n();

  const getStrength = () => {
    let score = 0;
    if (!password || password.length < 8) return 0;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  
  const strengthTextKeys = [
    'password.strength.very_weak',
    'password.strength.weak',
    'password.strength.fair',
    'password.strength.good',
    'password.strength.strong',
  ];
  const strengthColors = [
    'bg-red-500', 
    'bg-orange-500', 
    'bg-yellow-500',
    'bg-green-500', 
    'bg-green-500',
  ];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex space-x-1 rtl:space-x-reverse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded ${strength > i ? strengthColors[strength - 1] : 'bg-gray-200'}`}></div>
        ))}
      </div>
      <p className={`text-xs mt-1 font-semibold ${strength > 2 ? 'text-green-600' : 'text-gray-500'}`}>
        {t(strengthTextKeys[strength] as any)}
      </p>
    </div>
  );
};