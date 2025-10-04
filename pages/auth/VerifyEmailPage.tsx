import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../../hooks/useVerifyEmail';
import { useI18n } from '../../i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Header } from '../../components/Header';
import { useToast } from '../../context/ToastContext';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { showToast } = useToast();
  const token = searchParams.get('token');

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token, {
        onSuccess: () => {
          showToast(t('auth.verify_email.success.message'), 'success');
          setTimeout(() => navigate('/onboarding/role', { replace: true }), 2000);
        },
        onError: (error) => {
          showToast(error.message, 'error');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const renderContent = () => {
    if (!token) {
      return (
        <>
          <CardTitle>{t('auth.verify_email.error.title')}</CardTitle>
          <CardContent><p>{t('auth.verify_email.error.message')}</p></CardContent>
        </>
      );
    }

    if (verifyEmailMutation.isPending) {
      return (
        <>
          <CardTitle>{t('auth.verify_email.title')}</CardTitle>
          <CardContent className="flex flex-col items-center space-y-4">
            <Spinner />
            <p>{t('auth.verify_email.verifying')}</p>
          </CardContent>
        </>
      );
    }

    if (verifyEmailMutation.isError) {
      return (
        <>
          <CardTitle>{t('auth.verify_email.error.title')}</CardTitle>
          <CardContent><p>{verifyEmailMutation.error.message}</p></CardContent>
        </>
      );
    }

    if (verifyEmailMutation.isSuccess) {
      return (
        <>
          <CardTitle>{t('auth.verify_email.success.title')}</CardTitle>
          <CardContent><p>{t('auth.verify_email.success.message')}</p></CardContent>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            {renderContent()}
          </CardHeader>
        </Card>
      </main>
    </div>
  );
};

export default VerifyEmailPage;
