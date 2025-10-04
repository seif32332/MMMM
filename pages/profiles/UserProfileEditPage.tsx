import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { ONBOARDING_FORMS } from '../../constants';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import { DynamicForm } from '../../components/DynamicForm';
import { TranslationKey, User, Profile } from '../../types';
import { ImageUploader } from '../../components/ui/ImageUploader';

// Schema for the basic info tab
const getBasicInfoSchema = (t: (key: TranslationKey) => string) => z.object({
  fullName: z.string().min(2, t('register.error.email_required')), // Re-use a generic "required" message or add a new one
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  avatarUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});
type BasicInfoFormData = z.infer<ReturnType<typeof getBasicInfoSchema>>;

interface Tab {
    id: string;
    labelKey: TranslationKey;
}

export const UserProfileEditPage: React.FC = () => {
    const user = useUser();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('basic');

    const role = user?.profile?.primaryRole;
    const formDefinition = role ? ONBOARDING_FORMS[role] : null;
    const basicInfoSchema = getBasicInfoSchema(t);

    const {
        control: basicControl,
        handleSubmit: handleBasicSubmit,
        formState: { errors: basicErrors },
    } = useForm<BasicInfoFormData>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            headline: user?.profile?.headline || '',
            bio: user?.profile?.bio || '',
            location: user?.profile?.location || '',
            avatarUrl: user?.avatarUrl || '',
            bannerUrl: user?.bannerUrl || '',
        },
    });

    const {
        control: professionalControl,
        handleSubmit: handleProfessionalSubmit,
    } = useForm({
        defaultValues: user?.profile?.onboardingDetails || {},
    });

    const updateProfileMutation = useUpdateProfile({
        onSuccess: () => {
            showToast(t('profile.edit.success'), 'success');
            navigate(`/u/${user?.username || 'me'}`);
        },
        onError: (error) => {
            showToast(error.message, 'error');
        },
    });

    const onBasicSubmit = (data: BasicInfoFormData) => {
        const payload: Partial<Omit<User, 'profile'>> & { profile?: Partial<Profile> } = {
            fullName: data.fullName,
            avatarUrl: data.avatarUrl,
            bannerUrl: data.bannerUrl,
            profile: {
              headline: data.headline,
              bio: data.bio,
              location: data.location,
            }
        };
        updateProfileMutation.mutate(payload);
    };

    const onProfessionalSubmit = (data: Record<string, any>) => {
        updateProfileMutation.mutate({ profile: { onboardingDetails: data } });
    };

    if (!user) {
        return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;
    }
    
    const tabs: Tab[] = [
        { id: 'basic', labelKey: 'profile.edit.tabs.basic' },
        { id: 'professional', labelKey: 'profile.edit.tabs.professional' },
    ];

    return (
        <div className="container mx-auto py-12 px-4">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>{t('profile.edit.title')}</CardTitle>
                    <CardDescription>{t('profile.edit.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-b mb-6">
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

                    {activeTab === 'basic' && (
                        <form onSubmit={handleBasicSubmit(onBasicSubmit)} className="space-y-6">
                             <Controller
                                name="avatarUrl"
                                control={basicControl}
                                render={({ field }) => (
                                    <ImageUploader
                                        label={t('profile.edit.uploadAvatar.label')}
                                        currentImage={field.value}
                                        onImageSelect={field.onChange}
                                        aspectRatio="1/1"
                                    />
                                )}
                            />
                             <Controller
                                name="bannerUrl"
                                control={basicControl}
                                render={({ field }) => (
                                    <ImageUploader
                                        label={t('profile.edit.uploadBanner.label')}
                                        currentImage={field.value}
                                        onImageSelect={field.onChange}
                                        aspectRatio="3/1"
                                    />
                                )}
                            />
                            <div className="space-y-2">
                                <Label htmlFor="fullName">{t('profile.edit.fullName.label')}</Label>
                                <Controller name="fullName" control={basicControl} render={({field}) => <Input id="fullName" {...field} />} />
                                {basicErrors.fullName && <p className="text-sm text-destructive">{basicErrors.fullName.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="headline">{t('profile.edit.headline.label')}</Label>
                                <Controller name="headline" control={basicControl} render={({field}) => <Input id="headline" {...field} placeholder={t('profile.edit.headline.placeholder')} />} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="bio">{t('profile.edit.bio.label')}</Label>
                                <Controller name="bio" control={basicControl} render={({field}) => <textarea id="bio" {...field} placeholder={t('profile.edit.bio.placeholder')} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="location">{t('profile.edit.location.label')}</Label>
                                <Controller name="location" control={basicControl} render={({field}) => <Input id="location" {...field} placeholder={t('profile.edit.location.placeholder')} />} />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={updateProfileMutation.isPending}>
                                    {updateProfileMutation.isPending ? <Spinner size="sm"/> : t('profile.edit.saveChanges')}
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'professional' && formDefinition && (
                         <form onSubmit={handleProfessionalSubmit(onProfessionalSubmit)} className="space-y-6">
                            <DynamicForm formDefinition={formDefinition} control={professionalControl} t={t} />
                             <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={updateProfileMutation.isPending}>
                                    {updateProfileMutation.isPending ? <Spinner size="sm"/> : t('profile.edit.saveChanges')}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfileEditPage;