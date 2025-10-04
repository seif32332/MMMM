import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { useUser } from '../../stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Spinner } from '../../components/ui/Spinner';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { createCompany } from '../../services/companyService'; // Using service directly for mutation
import { useMutation } from '@tanstack/react-query';

const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  slug: z.string().min(3, "URL slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const CompanyCreatePage: React.FC = () => {
    const { t } = useI18n();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const user = useUser();

    const { control, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: { name: '', slug: '', industry: '', location: '', website: '', description: '', logoUrl: '' },
    });

    const createCompanyMutation = useMutation({
        mutationFn: (data: CompanyFormData) => {
            if (!user) throw new Error("User not authenticated");
            return createCompany(data, user.id);
        },
        onSuccess: (newCompany) => {
            showToast(t('company.create.success'), 'success');
            navigate(`/companies/${newCompany.slug}`);
        },
        onError: (error) => {
            showToast(error.message, 'error');
        }
    });

    const onSubmit = (data: CompanyFormData) => {
        createCompanyMutation.mutate(data);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{t('company.create.title')}</CardTitle>
                    <CardDescription>{t('company.create.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Controller
                            name="logoUrl"
                            control={control}
                            render={({ field }) => (
                                <ImageUploader
                                    label={t('company.create.logo.label')}
                                    currentImage={field.value}
                                    onImageSelect={field.onChange}
                                    aspectRatio="1/1"
                                />
                            )}
                        />
                         <div className="space-y-2">
                            <Label htmlFor="name">{t('company.create.name.label')}</Label>
                            <Controller name="name" control={control} render={({field}) => <Input id="name" {...field} />} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="slug">{t('company.create.slug.label')}</Label>
                            <Controller name="slug" control={control} render={({field}) => <Input id="slug" {...field} placeholder={t('company.create.slug.placeholder')} />} />
                            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                        </div>
                        {/* Add other fields: industry, location, website, description */}
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={createCompanyMutation.isPending}>
                                {createCompanyMutation.isPending ? <Spinner size="sm" /> : t('create')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyCreatePage;