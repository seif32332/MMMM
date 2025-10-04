import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useUser } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { ONBOARDING_FORMS } from '../../constants';
import { Header } from '../../components/Header';
import { OnboardingStepper } from '../../components/OnboardingStepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { DynamicForm } from '../../components/DynamicForm';

export const OnboardingDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useUser();
    const { t } = useI18n();
    const { showToast } = useToast();

    const role = user?.profile?.primaryRole;
    const storageKey = user?.id ? `onboarding-details-${user.id}` : null;
    const formDefinition = role ? ONBOARDING_FORMS[role] : null;

    const getDefaultValues = () => {
        let defaultValues: Record<string, any> = {};
        if (formDefinition) {
            formDefinition.fields.forEach(field => {
                defaultValues[field.name] = (field.type === 'multiselect' || field.type === 'tags') ? [] : '';
            });
        }
        if (storageKey) {
            try {
                const savedData = localStorage.getItem(storageKey);
                if (savedData) {
                    return { ...defaultValues, ...JSON.parse(savedData) };
                }
            } catch (error) {
                 console.error("Failed to parse onboarding data from localStorage", error);
            }
        }
        return user?.profile?.onboardingDetails || defaultValues;
    };

    const { control, handleSubmit } = useForm({
        defaultValues: getDefaultValues(),
    });

    const watchedValues = useWatch({ control });
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(watchedValues));
        }
    }, [watchedValues, storageKey]);


    useEffect(() => {
        if (!role) {
            navigate('/onboarding/role');
        }
    }, [role, navigate]);

    const updateProfileMutation = useUpdateProfile({
        onSuccess: () => {
            showToast(t('onboarding.details.save_success'), 'success');
            navigate('/onboarding/preferences');
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'An unknown error occurred.';
          showToast(message, 'error');
        }
    });

    const onSubmit = (data: Record<string, any>) => {
        updateProfileMutation.mutate({ profile: { onboardingDetails: data } });
    };

    if (!formDefinition) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto py-12 px-4">
                <OnboardingStepper currentStep={2} steps={['Role', 'Details', 'Preferences']} />
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>{t('onboarding.details.title')}</CardTitle>
                        <CardDescription>{t('onboarding.details.subtitle')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <DynamicForm formDefinition={formDefinition} control={control} t={t} />
                            <div className="flex justify-between pt-4">
                                <Button type="button" variant="outline" onClick={() => navigate('/onboarding/role')}>{t('back')}</Button>

                                <Button type="submit" disabled={updateProfileMutation.isPending}>
                                    {updateProfileMutation.isPending ? <Spinner size="sm"/> : t('next')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default OnboardingDetailsPage;