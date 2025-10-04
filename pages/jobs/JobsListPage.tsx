import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useJobs } from '../../hooks/useJobs';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { FilterSidebar } from '../../components/marketplace/FilterSidebar';
import { JobCard } from '../../components/jobs/JobCard';
import { useUser } from '../../stores/authStore';
import { UserPrimaryRole } from '../../types';

export const JobsListPage: React.FC = () => {
    const { t } = useI18n();
    const user = useUser();
    const { data: jobs, isLoading, isError } = useJobs();

    const handleApplyFilters = (filters: any) => {
        console.log('Applying job filters:', filters);
    };

    const canCreateJob = user?.profile?.primaryRole === UserPrimaryRole.COMPANY;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('jobs.title')}</h1>
                 {canCreateJob && (
                    <Link to="/jobs/new">
                        <Button>{t('jobs.create.title')}</Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                <aside className="col-span-1">
                    <FilterSidebar onApplyFilters={handleApplyFilters} />
                </aside>
                <main className="col-span-3">
                    {isLoading && <div className="text-center py-16"><Spinner /></div>}
                    {isError && <p className="text-destructive text-center">{t('marketplace.loading')}</p>}
                    {jobs && jobs.length > 0 && (
                        <div className="space-y-6">
                            {jobs.map(job => <JobCard key={job.id} job={job} />)}
                        </div>
                    )}
                     {jobs && jobs.length === 0 && (
                        <p className="text-center text-gray-500 py-16">{t('marketplace.empty.jobs')}</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobsListPage;