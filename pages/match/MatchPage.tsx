import React from 'react';
import { useI18n } from '../../i18n';
import { useSuggestions } from '../../hooks/useSuggestions';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { SuggestionCard } from '../../components/suggestions/SuggestionCard';
import { UserPrimaryRole } from '../../types';
import { useUser } from '../../stores/authStore';
import { TranslationKey } from '../../types';

const getSuggestionTitleKey = (role: UserPrimaryRole | undefined): TranslationKey => {
    switch (role) {
        case UserPrimaryRole.INVESTOR:
            return 'match.suggestions.for.investor';
        case UserPrimaryRole.FOUNDER:
            return 'match.suggestions.for.founder';
        default:
            return 'match.for_you';
    }
}

export const MatchPage: React.FC = () => {
    const { t } = useI18n();
    const user = useUser();
    const { data: suggestions, isLoading, isError } = useSuggestions();

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-20"><Spinner /></div>;
        }

        if (isError) {
            return <p className="text-center text-destructive py-20">Failed to load suggestions.</p>;
        }

        if (!suggestions || suggestions.length === 0) {
            return (
                <div className="text-center py-20">
                    <h3 className="text-xl font-semibold">{t('match.suggestions.empty.title')}</h3>
                    <p className="text-gray-600 mt-2">{t('match.suggestions.empty.description')}</p>
                </div>
            );
        }

        const titleKey = getSuggestionTitleKey(user?.profile?.primaryRole);

        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t(titleKey)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suggestions.map(suggestion => (
                        <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                    ))}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">{t('match.title')}</h1>
                <p className="text-lg text-gray-600 mt-2">{t('match.subtitle')}</p>
            </div>
            {renderContent()}
        </div>
    );
};

export default MatchPage;