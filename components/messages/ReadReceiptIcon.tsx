import React from 'react';
import { MessageStatus } from '../../types';

interface ReadReceiptIconProps {
  status: MessageStatus;
}

const SentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DeliveredIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
    <line x1="15" y1="6" x2="9" y2="12"></line>
  </svg>
);

export const ReadReceiptIcon: React.FC<ReadReceiptIconProps> = ({ status }) => {
  const commonClass = 'text-gray-400';
  const readClass = 'text-blue-500';

  switch (status) {
    case 'sending':
      return null; // Or a clock icon
    case 'sent':
      return <span className={commonClass}><SentIcon /></span>;
    case 'delivered':
      return <span className={commonClass}><DeliveredIcon /></span>;
    case 'read':
      return <span className={readClass}><DeliveredIcon /></span>;
    default:
      return null;
  }
};