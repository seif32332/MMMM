import React from 'react';
import { Link } from 'react-router-dom';
import { Suggestion, User, Deal, Job } from '../../types';
import { useI18n } from '../../i18n';
import { Button } from '../ui/Button';

const UserSuggestion: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <img src={user.avatarUrl} alt={user.fullName} className="w-12 h-12 rounded-full" />
        <div className="flex-grow">
            <Link to={`/u/${user.username}`} className="font-bold hover:underline">{user.fullName}</Link>
            <p className="text-sm text-gray-600 truncate">{user.profile?.headline}</p>
        </div>
        <Link to={`/u/${user.username}`}>
            <Button variant="outline" size="sm">View</Button>
        </Link>
    </div>
);

const DealSuggestion: React.FC<{ deal: Deal }> = ({ deal }) => (
     <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-primary">
            {deal.industry.substring(0, 1)}
        </div>
        <div className="flex-grow">
            <Link to={`/deals/${deal.id}`} className="font-bold hover:underline">{deal.title}</Link>
            <p className="text-sm text-gray-600 truncate">{deal.stage} - Seeking ${deal.amountMin.toLocaleString()}+</p>
        </div>
        <Link to={`/deals/${deal.id}`}>
            <Button variant="outline" size="sm">View</Button>
        </Link>
    </div>
);

const JobSuggestion: React.FC<{ job: Job }> = ({ job }) => (
    <div>Job Suggestion placeholder</div>
);


export const SuggestionCard: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
    const { t } = useI18n();

    const renderContent = () => {
        switch (suggestion.type) {
            case 'USER':
                return <UserSuggestion user={suggestion.data as User} />;
            case 'DEAL':
                return <DealSuggestion deal={suggestion.data as Deal} />;
            case 'JOB':
                return <JobSuggestion job={suggestion.data as Job} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-3 border rounded-lg hover:bg-gray-50">
            {renderContent()}
            <div className="mt-2 pl-16 rtl:pr-16">
                <p className="text-xs text-gray-500">
                    <span className="font-semibold">{t('match.reason')}:</span> {suggestion.reason}
                </p>
            </div>
        </div>
    );
};