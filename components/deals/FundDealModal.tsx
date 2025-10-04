import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../hooks/useWallet';
import { useAllocateFunds } from '../../hooks/useWalletMutations';
import { Deal } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Spinner } from '../ui/Spinner';

interface FundDealModalProps {
    deal: Deal;
    onClose: () => void;
}

const formatCurrency = (amount: bigint, currency: string) => 
    (Number(amount) / 100).toLocaleString('en-US', { style: 'currency', currency });


export const FundDealModal: React.FC<FundDealModalProps> = ({ deal, onClose }) => {
    const { t } = useI18n();
    const { showToast } = useToast();
    const { data: wallet } = useWallet();
    const allocateMutation = useAllocateFunds();

    const validationSchema = z.object({
        amount: z.coerce.number()
            .positive("Amount must be positive")
            .max(Number(wallet?.available || 0) / 100, t('wallet.fund.error.insufficient')),
    });
    type FundFormData = z.infer<typeof validationSchema>;

    // FIX: Explicitly type `useForm` with `FundFormData` and provide `defaultValues` to resolve type mismatches between react-hook-form and the zod resolver, and to ensure the submit handler receives correctly typed data.
    const { control, handleSubmit, formState: { errors } } = useForm<FundFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            amount: undefined,
        }
    });

    const onSubmit = (data: FundFormData) => {
        // Convert back to "cents" bigint
        const amountInCents = BigInt(Math.round(data.amount * 100));
        allocateMutation.mutate(
            { dealId: deal.id, amount: amountInCents },
            {
                onSuccess: () => {
                    showToast(t('wallet.fund.success'), 'success');
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
                    <CardTitle>{t('deals.fund.title')}</CardTitle>
                    <CardDescription>
                        {t('wallet.balance.available')}: {wallet ? formatCurrency(wallet.available, wallet.currency) : '...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">{t('wallet.fund.amount.label')}</Label>
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field }) => <Input id="amount" type="number" step="100" {...field} />}
                            />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                        </div>

                        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={allocateMutation.isPending}>
                                {allocateMutation.isPending ? <Spinner size="sm" /> : t('wallet.fund.cta')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};