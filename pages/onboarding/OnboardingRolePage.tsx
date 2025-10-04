import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { UserPrimaryRole } from '../../types';
import { ROLES } from '../../constants';
import { Header } from '../../components/Header';
import { Card } from '../../components/ui/Card';
import { OnboardingStepper } from '../../components/OnboardingStepper';

export const OnboardingRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuthActions();
  const { t } = useI18n();

  const handleRoleSelect = (role: UserPrimaryRole) => {
    updateUser({ profile: { primaryRole: role } });
    navigate('/onboarding/details');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-12 px-4 text-center">
        <OnboardingStepper currentStep={1} steps={['Role', 'Details', 'Preferences']} />
        <h1 className="text-3xl font-bold mb-2">{t('onboarding.role.title')}</h1>
        <p className="text-gray-600 mb-8">{t('onboarding.role.subtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {ROLES.map((role) => (
            <Card
              key={role.id}
              className="p-6 text-center hover:shadow-lg hover:border-primary transition-all cursor-pointer"
              onClick={() => handleRoleSelect(role.id)}
            >
              <h3 className="text-xl font-bold text-primary mb-2">{t(role.titleKey)}</h3>
              <p className="text-gray-500">{t(role.descriptionKey)}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OnboardingRolePage;