import React from 'react';
import { useI18n } from '../../i18n';

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z" />
    </svg>
);


const ConversationPlaceholder: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-50">
        <MessageIcon />
        <h2 className="mt-4 text-xl font-semibold">{t('messages.select_conversation')}</h2>
    </div>
  );
};

export default ConversationPlaceholder;
