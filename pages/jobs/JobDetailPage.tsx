import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useJob } from '../../hooks/useJob';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useStartConversation } from '../../hooks/useStartConversation';
import { useToast } from '../../context/ToastContext';

const DetailItem: React.FC<{ labelKey: any; value: string }> = ({ labelKey, value }) => {
    const { t } = useI18n();
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-500">{t(labelKey)}</h3>
            <p className="text-md text-gray-800 capitalize">{value.replace('_', ' ')}</p>
        </div>
    );
}

export const JobDetailPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { t } = useI18n();
    const { data: job, isLoading, isError } = useJob(jobId);
    const startConversationMutation = useStartConversation();
    const { showToast } = useToast();

    if (isLoading) {
        return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (isError || !job) {
        return <div className="p-8 text-center text-destructive">Could not load the job posting.</div>;
    }
    
    const handleMessageRecruiter = () => {
        startConversationMutation.mutate(job.company.ownerId, {
            onError: (error) => showToast(error.message, 'error')
        });
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <Card>
                <CardHeader className="flex-row items-start space-x-4 rtl:space-x-reverse">
                    <img src={job.company.logoUrl} alt={`${job.company.name} logo`} className="w-16 h-16 rounded-lg border p-1"/>
                    <div>
                        <CardTitle className="text-2xl">{job.title}</CardTitle>
                        <Link to={`/companies/${job.company.slug}`} className="text-primary hover:underline">{job.company.name}</Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                       <DetailItem labelKey="jobs.details.location" value={job.location} />
                       <DetailItem labelKey="jobs.details.employmentType" value={job.employmentType} />
                    </div>
                    <div className="prose max-w-none">
                        <h3 className="font-bold">Job Description</h3>
                        <p className="whitespace-pre-wrap">{job.description}</p>
                    </div>
                     <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg">{t('applyNow')}</Button>
                         <Button
                            size="lg"
                            variant="outline"
                            onClick={handleMessageRecruiter}
                            disabled={startConversationMutation.isPending}
                        >
                           {startConversationMutation.isPending ? <Spinner size="sm"/> : t('jobs.details.messageRecruiter')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default JobDetailPage;