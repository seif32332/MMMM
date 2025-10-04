import React from 'react';
import { useUser } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { UserPrimaryRole, TranslationKey } from '../../types';
import { useSuggestions } from '../../hooks/useSuggestions';
import { Spinner } from '../../components/ui/Spinner';
import { SuggestionCard } from '../../components/suggestions/SuggestionCard';

interface QuickLink {
    to: string;
    labelKey: TranslationKey;
    variant?: 'default' | 'outline';
}

const getRoleSpecificLinks = (user: ReturnType<typeof useUser>): QuickLink[] => {
    if (!user || !user.profile) return [];

    switch (user.profile.primaryRole) {
        case UserPrimaryRole.FOUNDER:
            return [
                { to: '/deals/new', labelKey: 'dashboard.quickLinks.createDeal' },
                { to: '/deals', labelKey: 'dashboard.quickLinks.viewMyDeals', variant: 'outline' },
            ];
        case UserPrimaryRole.INVESTOR:
            return [
                { to: '/deals', labelKey: 'dashboard.quickLinks.browseDeals' },
                // { to: '/investments', labelKey: 'View My Investments', variant: 'outline' },
            ];
        case UserPrimaryRole.COMPANY:
             return [
                { to: '/jobs/new', labelKey: 'dashboard.quickLinks.createJob' },
                { to: `/companies/${user.companyMemberships?.[0]?.companySlug || 'none'}`, labelKey: 'dashboard.quickLinks.viewMyCompany', variant: 'outline' },
            ];
        case UserPrimaryRole.JOB_SEEKER:
            return [
                { to: '/jobs', labelKey: 'dashboard.quickLinks.browseJobs' },
                // { to: '/applications', labelKey: 'View My Applications', variant: 'outline' },
            ];
        default:
            return [];
    }
};

const RoleSpecificQuickLinks: React.FC = () => {
    const user = useUser();
    const links = getRoleSpecificLinks(user);
    const { t } = useI18n();

    if (links.length === 0) return null;

    return (
        <>
            {links.map(link => (
                <Link to={link.to} key={link.to}>
                    <Button className="w-full justify-start" variant={link.variant}>
                        {t(link.labelKey)}
                    </Button>
                </Link>
            ))}
        </>
    );
};

const Suggestions: React.FC = () => {
    const { data: suggestions, isLoading } = useSuggestions();
    const { t } = useI18n();

    if (isLoading) {
        return <div className="text-center py-8"><Spinner /></div>;
    }

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>{t('match.suggestions.empty.title')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {suggestions.slice(0, 3).map(suggestion => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
            {suggestions.length > 3 && (
                 <Link to="/match" className="block text-center mt-4">
                    <Button variant="outline" className="w-full">{t('dashboard.ai_suggestions.view_all')}</Button>
                </Link>
            )}
        </div>
    );
};


export const DashboardPage: React.FC = () => {
  const user = useUser();
  const { t } = useI18n();
  
  const welcomeName = user?.fullName || user?.email || 'User';
  const roleName = t(`roles.${user?.profile?.primaryRole?.toLowerCase()}.title` as TranslationKey)

  return (
    <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">{t('dashboard.welcome', { name: welcomeName })}</h1>
            <p className="text-lg text-gray-600 mt-2">{t('dashboard.description')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>{t('dashboard.quickLinks.title', { role: roleName })}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                     <RoleSpecificQuickLinks />
                     <hr className="my-2"/>
                     <Link to="/feed">
                        <Button variant="outline" className="w-full justify-start">{t('dashboard.quickLinks.feed')}</Button>
                    </Link>
                    <Link to={`/u/${user?.username || 'me'}/edit`}>
                        <Button variant="outline" className="w-full justify-start">{t('dashboard.quickLinks.editProfile')}</Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>{t('dashboard.ai_suggestions.title')}</CardTitle>
                    <CardDescription>{t('dashboard.ai_suggestions.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                   <Suggestions />
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default DashboardPage;