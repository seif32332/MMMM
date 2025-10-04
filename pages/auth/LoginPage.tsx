import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useI18n } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { Header } from '../../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { TranslationKey } from '../../types';
import { useLogin } from '../../hooks/useLogin';

const getValidationSchema = (t: (key: TranslationKey) => string) => z.object({
    email: z.string().nonempty(t('register.error.email_required')).email(t('register.error.invalid_email')),
    password: z.string().nonempty(t('register.error.password_required')),
});

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useI18n();
    const { showToast } = useToast();
    const [serverError, setServerError] = useState<string | null>(null);

    const validationSchema = getValidationSchema(t);
    type LoginFormData = z.infer<typeof validationSchema>;

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: { email: '', password: '' },
    });
    
    const loginMutation = useLogin({
        onSuccess: () => {
            showToast(t('login.success.message'), 'success');
            navigate('/dashboard');
        },
        onError: (error) => {
          // The hook already shows a toast, but we can also set local state for inline errors.
          setServerError(error.message);
        }
    });

    const onSubmit = (data: LoginFormData) => {
        setServerError(null);
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showLogin={false} />
            <main className="flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{t('login.title')}</CardTitle>
                        <CardDescription>{t('login.subtitle')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('register.email_label')}</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => <Input id="email" type="email" placeholder={t('register.email_placeholder')} {...field} />}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('register.password_label')}</Label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => <Input id="password" type="password" {...field} />}
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>
                            {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
                            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                {loginMutation.isPending ? <Spinner size="sm" /> : t('login.cta')}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="text-sm justify-center">
                       <p>{t('login.no_account')} <Link to="/auth/register" className="text-primary hover:underline">{t('login.register_link')}</Link></p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
};

export default LoginPage;
