import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { useCreateTopupIntent } from '../../hooks/useWalletMutations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Spinner } from '../ui/Spinner';

interface TopupModalProps {
    onClose: () => void;
}

const validationSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive").min(5, "Minimum top-up is 5 SAR"),
});
type TopupFormData = z.infer<typeof validationSchema>;

export const TopupModal: React.FC<TopupModalProps> = ({ onClose }) => {
    const { t } = useI18n();
    const { showToast } = useToast();
    const topupMutation = useCreateTopupIntent();

    const { control, handleSubmit, formState: { errors } } = useForm<TopupFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {}
    });

    const onSubmit = (data: TopupFormData) => {
        // Convert to "cents" bigint
        const amountInCents = BigInt(Math.round(data.amount * 100));
        topupMutation.mutate(
            amountInCents,
            {
                onSuccess: () => {
                    showToast(t('wallet.topup.success'), 'success');
                    onClose();
                },
                onError: (error) => {
                    showToast(error.message, 'error');
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('wallet.topup.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">{t('wallet.topup.amount.label')}</Label>
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field }) => <Input id="amount" type="number" placeholder={t('wallet.topup.amount.placeholder')} {...field} />}
                            />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                        </div>

                        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={topupMutation.isPending}>
                                {topupMutation.isPending ? <Spinner size="sm" /> : t('wallet.topup.submit')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};