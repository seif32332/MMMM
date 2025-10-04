
import React from 'react';
import { useUser } from '../../stores/authStore';
import { useI18n } from '../../i18n';
import { useResendVerification } from '../../hooks/useResendVerification';
import { useToast } from '../../context/ToastContext';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';

export const EmailVerificationBanner: React.FC = () => {
    const user = useUser();
    const { t } = useI18n();
    const { showToast } = useToast();

    const resendMutation = useResendVerification();

    const handleResend = () => {
        resendMutation.mutate(undefined, {
            onSuccess: () => {
                showToast(t('auth.verification_banner.resend_success'), 'info');
            },
            onError: (error) => {
                showToast(error.message, 'error');
            }
        });
    };

    // Don't show the banner if user is not loaded, or if they are verified.
    if (!user || user.emailVerified) {
        return null;
    }

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">{t('auth.verification_banner.title')}</p>
            <p>
                <Button 
                    variant="link"
                    onClick={handleResend}
                    disabled={resendMutation.isPending}
                    className="font-bold text-yellow-700 hover:text-yellow-800"
                >
                    {resendMutation.isPending ? <Spinner size="sm" /> : t('auth.verification_banner.resend_link')}
                </Button>
            </p>
        </div>
    );
};
