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
import { PasswordStrength } from '../../components/PasswordStrength';
import { Spinner } from '../../components/ui/Spinner';
import { TranslationKey } from '../../types';
import { useRegister } from '../../hooks/useRegister';

// Define the validation schema outside the component to prevent re-creation on every render.
const getValidationSchema = (t: (key: TranslationKey) => string) => z.object({
    email: z.string().nonempty(t('register.error.email_required')).email(t('register.error.invalid_email')),
    password: z.string().min(8, t('register.error.password_min_length')),
    confirmPassword: z.string(),
    acceptPolicy: z.boolean().refine(val => val === true, {
      message: t('register.error.policy_required'),
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: t('register.error.password_mismatch'),
    path: ['confirmPassword'],
});

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { showToast } = useToast();
  
  const [serverError, setServerError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validationSchema = getValidationSchema(t);
  type RegisterFormData = z.infer<typeof validationSchema>;

  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', acceptPolicy: false },
  });
  
  const passwordValue = watch('password');

  const registerMutation = useRegister({
    onSuccess: () => {
      showToast(t('register.success.title'), 'success');
      setRegistrationSuccess(true);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setServerError(message);
      showToast(message, 'error');
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError(null);
    registerMutation.mutate(data);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showLogin={true} />
        <main className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>{t('auth.verify_email.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t('register.success.message')}</p>
              <p className="mt-2 text-sm text-gray-600">{t('auth.verify_email.subtitle')}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showLogin={true} />
      <main className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('register.title')}</CardTitle>
            <CardDescription>{t('register.subtitle')}</CardDescription>
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
                <PasswordStrength password={passwordValue} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('register.confirm_password_label')}</Label>
                 <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => <Input id="confirm-password" type="password" {...field} />}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Controller
                  name="acceptPolicy"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id="accept-policy"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  )}
                />
                <Label htmlFor="accept-policy">{t('register.accept_policy')}</Label>
              </div>
              {errors.acceptPolicy && <p className="text-sm text-destructive">{errors.acceptPolicy.message}</p>}
              {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
              
              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? <Spinner size="sm" /> : t('register.cta')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm justify-center">
             <p>{t('register.have_account')} <Link to="/" className="text-primary hover:underline">{t('register.login_link')}</Link></p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default RegisterPage;