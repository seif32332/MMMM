import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useUser, useAuthActions } from '../stores/authStore';
import { useI18n } from '../i18n';
import { ONBOARDING_FORMS } from '../constants';
import { Header } from '../components/Header';
import { OnboardingStepper } from '../components/OnboardingStepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { FormField, TranslationKey } from '../types';
import { TagsInput } from '../components/ui/TagsInput';
import { MultiSelect } from '../components/ui/MultiSelect';
import { Spinner } from '../components/ui/Spinner';
import { useToast } from '../context/ToastContext';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

const DynamicField: React.FC<{ fieldDef: FormField; control: any; t: (key: TranslationKey) => string; }> = ({ fieldDef, control, t }) => {
    return (
        <Controller
            name={fieldDef.name}
            control={control}
            render={({ field }) => {
                const commonProps = {
                    ...field,
                    id: fieldDef.name,
                    placeholder: fieldDef.placeholderKey ? t(fieldDef.placeholderKey) : ''
                };

                switch (fieldDef.type) {
                    case 'text':
                    case 'number':
                    case 'email':
                        return <Input {...commonProps} type={fieldDef.type} />;
                    case 'textarea':
                        return <textarea {...commonProps} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />;
                    case 'select':
                        return (
                            <Select {...commonProps}>
                                <option value="">{`Select ${t(fieldDef.labelKey)}`}</option>
                                {fieldDef.options?.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                            </Select>
                        );
                    case 'multiselect':
                        return (
                            <MultiSelect
                                options={fieldDef.options?.map(opt => ({ value: opt.value, label: t(opt.labelKey) })) || []}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder={fieldDef.placeholderKey ? t(fieldDef.placeholderKey) : `Select...`}
                            />
                        );
                    case 'tags':
                        return (
                            <TagsInput
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder={fieldDef.placeholderKey ? t(fieldDef.placeholderKey) : ''}
                            />
                        );
                    default:
                        return null;
                }
            }}
        />
    );
};

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
        // FIX: The `onboardingDetails` object must be nested inside a `profile` property to match the expected payload structure for updating the profile.
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
                            {formDefinition.fields.map(fieldDef => (
                                <div key={fieldDef.name} className="space-y-2">
                                    <Label htmlFor={fieldDef.name}>{t(fieldDef.labelKey)}</Label>
                                    <DynamicField fieldDef={fieldDef} control={control} t={t} />
                                </div>
                            ))}
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