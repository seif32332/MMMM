import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const LandingPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-4xl font-bold mb-4">{t('appName')}</h1>
      <p className="text-xl text-gray-600 mb-8">{t('register.subtitle')}</p>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Join the platform to connect with founders, investors, and opportunities.</p>
          <Link to="/auth/register">
            <Button size="lg" className="w-full">{t('register.cta')}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;