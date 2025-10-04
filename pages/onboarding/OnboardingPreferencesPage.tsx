import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useUser } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { Header } from '../../components/Header';
import { OnboardingStepper } from '../../components/OnboardingStepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { Switch } from '../../components/ui/Switch';
import { Spinner } from '../../components/ui/Spinner';
import { OnboardingPreferences } from '../../types';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { useToast } from '../../context/ToastContext';

export const OnboardingPreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const { t } = useI18n();
  const { showToast } = useToast();
  
  const { control, handleSubmit } = useForm<OnboardingPreferences>({
    defaultValues: user?.profile?.onboardingPreferences || {
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
    },
  });

  useEffect(() => {
    // Redirect if user hasn't completed previous steps
    if (!user?.profile?.primaryRole || !user?.profile?.onboardingDetails) {
      navigate('/onboarding/role', { replace: true });
    }
  }, [user, navigate]);
  
  const updateProfileMutation = useUpdateProfile({
      onSuccess: () => {
        showToast(t('onboarding.success.message'), 'success');
        // Clean up local storage from the previous step
        if (user?.id) {
            localStorage.removeItem(`onboarding-details-${user.id}`);
        }
        // Navigate to the dashboard after a delay to let the user see the toast.
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
      },
      onError: (error) => {
          const message = error instanceof Error ? error.message : 'An unknown error occurred.';
          showToast(message, 'error');
      }
  });


  const onSubmit = (data: OnboardingPreferences) => {
    // Correctly nest preferences and mark the profile as complete within the profile object.
    updateProfileMutation.mutate({ 
        profile: {
            onboardingPreferences: data,
            profileCompleted: true, 
        }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <OnboardingStepper currentStep={3} steps={['Role', 'Details', 'Preferences']} />
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>{t('onboarding.preferences.title')}</CardTitle>
            <CardDescription>{t('onboarding.preferences.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <Controller
                name="emailNotifications"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="email-notifications">{t('onboarding.preferences.email')}</Label>
                    <Switch
                      id="email-notifications"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                name="smsNotifications"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="sms-notifications">{t('onboarding.preferences.sms')}</Label>
                    <Switch
                      id="sms-notifications"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

             <Controller
                name="inAppNotifications"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="in-app-notifications">{t('onboarding.preferences.in_app')}</Label>
                    <Switch
                      id="in-app-notifications"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/onboarding/details')}>{t('back')}</Button>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? <Spinner size="sm" /> : t('finish')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OnboardingPreferencesPage;
