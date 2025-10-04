import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { useCreateJob } from '../../hooks/useCreateJob';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Spinner } from '../../components/ui/Spinner';
import { Select } from '../../components/ui/Select';
import { Company } from '../../types';
import { useUser } from '../../stores/authStore';

const jobSchema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().min(20, "Description is required"),
  location: z.string().nonempty("Location is required"),
  employmentType: z.enum(['full_time', 'part_time', 'contract']),
});

type JobFormData = z.infer<typeof jobSchema>;

export const JobCreatePage: React.FC = () => {
    const { t } = useI18n();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const user = useUser();
    
    // In a real app, you'd get the user's associated company from their profile.
    // FIX: Add ownerId to satisfy the hook's type. Based on mock data, the user is the owner.
    const userCompany = user?.companyMemberships?.[0] 
        ? { id: user.companyMemberships[0].companyId, name: user.companyMemberships[0].companyName, slug: user.companyMemberships[0].companySlug, logoUrl: '', ownerId: user.id }
        : undefined;

    const { control, handleSubmit, formState: { errors } } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: { employmentType: 'full_time' }
    });

    const createJobMutation = useCreateJob(userCompany, {
        onSuccess: (newJob) => {
            showToast(t('jobs.create.success'), 'success');
            navigate(`/jobs/${newJob.id}`);
        },
        onError: (error) => {
            showToast(error.message, 'error');
        }
    });

    const onSubmit = (data: JobFormData) => {
        createJobMutation.mutate(data);
    };
    
    if (!userCompany) {
        return (
             <div className="container mx-auto py-12 px-4">
                <Card className="max-w-2xl mx-auto text-center">
                    <CardHeader>
                        <CardTitle>{t('jobs.create.noCompany.title')}</CardTitle>
                        <CardDescription>{t('jobs.create.noCompany.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/companies/new">
                            <Button>{t('jobs.create.noCompany.cta')}</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{t('jobs.create.title')}</CardTitle>
                    <CardDescription>{t('jobs.create.subtitle')} for {userCompany.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('jobs.create.jobTitle.label')}</Label>
                            <Controller name="title" control={control} render={({field}) => <Input id="title" {...field} />} />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">{t('jobs.create.description.label')}</Label>
                            <Controller name="description" control={control} render={({field}) => <textarea id="description" {...field} rows={8} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Controller name="location" control={control} render={({field}) => <Input id="location" {...field} />} />
                                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="employmentType">Employment Type</Label>
                                <Controller name="employmentType" control={control} render={({field}) => (
                                    <Select id="employmentType" {...field}>
                                        <option value="full_time">Full-time</option>
                                        <option value="part_time">Part-time</option>
                                        <option value="contract">Contract</option>
                                    </Select>
                                )} />
                                {errors.employmentType && <p className="text-sm text-destructive">{errors.employmentType.message}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={createJobMutation.isPending}>
                                {createJobMutation.isPending ? <Spinner size="sm" /> : t('submit')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default JobCreatePage;