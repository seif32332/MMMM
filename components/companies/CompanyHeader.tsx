import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { Company } from '../../types';
import { Button } from '../ui/Button';

interface CompanyHeaderProps {
    company: Company;
    isOwner: boolean;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company, isOwner }) => {
    const { t } = useI18n();

    return (
        <div className="bg-white border-b">
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6 rtl:space-x-reverse">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-200 border shadow-sm flex-shrink-0 mx-auto md:mx-0">
                         <img 
                            src={company.logoUrl || `https://api.dicebear.com/8.x/logo/svg?seed=${company.name}`} 
                            alt={`${company.name} logo`}
                            className="w-full h-full rounded-lg object-contain p-2"
                        />
                    </div>
                    <div className="flex-grow flex flex-col md:flex-row justify-between items-center w-full mt-4 md:mt-0 text-center md:text-left">
                        <div>
                            <h1 className="text-3xl font-bold">{company.name}</h1>
                            <p className="text-gray-600 mt-1">{company.industry}</p>
                            <p className="text-sm text-gray-500 mt-1">{company.location}</p>
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse mt-4 md:mt-0">
                            {isOwner ? (
                                <Button>{t('company.edit')}</Button>
                            ) : (
                                <>
                                    <Button>{t('profile.follow')}</Button>
                                    <Button variant="outline">{t('profile.message')}</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};