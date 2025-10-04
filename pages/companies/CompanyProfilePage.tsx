import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import { Spinner } from '../../components/ui/Spinner';
import { CompanyHeader } from '../../components/companies/CompanyHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { TranslationKey } from '../../types';
import { useJobs } from '../../hooks/useJobs';
import { JobCard } from '../../components/jobs/JobCard';
import { useDeals } from '../../hooks/useDeals';
import { DealCard } from '../../components/deals/DealCard';

interface Tab {
    id: string;
    labelKey: TranslationKey;
}

const JobsTab: React.FC<{ companyId: string }> = ({ companyId }) => {
    const { t } = useI18n();
    const { data: jobs, isLoading } = useJobs({ companyId });

    return (
        <Card>
            <CardHeader><CardTitle>{t('company.tabs.jobs')}</CardTitle></CardHeader>
            <CardContent>
                 {isLoading ? <Spinner /> : (
                    (jobs && jobs.length > 0) ? (
                        <div className="space-y-4">
                            {jobs.map(job => <JobCard key={job.id} job={job} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('company.jobs.placeholder')}</p>
                    )
                )}
            </CardContent>
        </Card>
    );
};

const DealsTab: React.FC<{ companyId: string }> = ({ companyId }) => {
    const { t } = useI18n();
    const { data: deals, isLoading } = useDeals({ companyId });

     return (
        <Card>
            <CardHeader><CardTitle>{t('company.tabs.deals')}</CardTitle></CardHeader>
            <CardContent>
                 {isLoading ? <Spinner /> : (
                    (deals && deals.length > 0) ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('company.deals.placeholder')}</p>
                    )
                )}
            </CardContent>
        </Card>
    );
}

export const CompanyProfilePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const loggedInUser = useUser();
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState('jobs');

    const { data: company, isLoading, isError } = useCompanyProfile(slug);

    if (isLoading) {
        return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (isError || !company) {
        return <div className="p-8 text-center text-destructive">Could not load company profile.</div>;
    }

    const isOwner = loggedInUser?.id === company.ownerId;

    const tabs: Tab[] = [
        { id: 'jobs', labelKey: 'company.tabs.jobs' },
        { id: 'deals', labelKey: 'company.tabs.deals' },
        { id: 'team', labelKey: 'company.tabs.team' },
    ];

    const renderTabContent = () => {
        switch(activeTab) {
            case 'jobs':
                return <JobsTab companyId={company.id} />;
            case 'deals':
                return <DealsTab companyId={company.id} />;
            case 'team':
            default:
                return (
                    <Card>
                        <CardHeader><CardTitle>{t(tabs.find(t => t.id === activeTab)!.labelKey)}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Content for this tab is coming soon.</p>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <CompanyHeader company={company} isOwner={isOwner} />

            <div className="container mx-auto p-4">
                {/* Tabs */}
                <div className="mt-6 border-b">
                    <nav className="flex space-x-4 rtl:space-x-reverse">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-3 font-medium text-sm ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t(tab.labelKey)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default CompanyProfilePage;