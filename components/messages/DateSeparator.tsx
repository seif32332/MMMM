import React from 'react';
import { useI18n } from '../../i18n';

interface DateSeparatorProps {
  date: string; // Should be a string from Date.toDateString()
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
    const { t, locale } = useI18n();

    const getFormattedDate = () => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        const messageDate = new Date(date);

        if (today.toDateString() === messageDate.toDateString()) {
            return t('messages.date_separator.today');
        }
        if (yesterday.toDateString() === messageDate.toDateString()) {
            return t('messages.date_separator.yesterday');
        }

        // Format for other dates, e.g., "October 26"
        return messageDate.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'long',
            day: 'numeric',
            year: today.getFullYear() !== messageDate.getFullYear() ? 'numeric' : undefined,
        });
    };

    return (
        <div className="flex items-center justify-center my-4">
            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                {getFormattedDate()}
            </span>
        </div>
    );
};