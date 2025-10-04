import React from 'react';
import { useUser, useAuthActions } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const user = useUser();
  const { logout } = useAuthActions();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast(t('auth.logout_success'), 'success');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{t('dashboard.welcome')}, {user?.fullName || user?.email}!</CardTitle>
                <CardDescription>
                  {user?.email}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-gray-700 mb-6">{t('dashboard.description')}</p>
                 {user?.profile?.onboardingDetails && Object.keys(user.profile.onboardingDetails).length > 0 && (
                    <div className="text-left bg-gray-100 p-4 rounded-md my-4">
                        <h4 className="font-bold mb-2">{t('dashboard.onboarding_data_title')}</h4>
                        <pre className="text-sm whitespace-pre-wrap break-all">
                            {JSON.stringify(user.profile.onboardingDetails, null, 2)}
                        </pre>
                    </div>
                )}
                {user?.profile?.onboardingPreferences && (
                    <div className="text-left bg-gray-100 p-4 rounded-md my-4">
                        <h4 className="font-bold mb-2">{t('dashboard.preferences_title')}</h4>
                        <pre className="text-sm whitespace-pre-wrap break-all">
                            {JSON.stringify(user.profile.onboardingPreferences, null, 2)}
                        </pre>
                    </div>
                )}
                <Button onClick={handleLogout} variant="destructive" className="mt-4">{t('dashboard.logout')}</Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;