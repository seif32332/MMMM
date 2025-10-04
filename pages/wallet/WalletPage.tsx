import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import { useWallet } from '../../hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { TransactionList } from '../../components/wallet/TransactionList';
import { TopupModal } from '../../components/wallet/TopupModal';

const BalanceCard: React.FC<{ label: string; amount: bigint; currency: string; className?: string }> = ({ label, amount, currency, className }) => {
    // Format bigint "cents" to a decimal string
    const formattedAmount = (Number(amount) / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    });

    return (
        <div className={`p-4 rounded-lg ${className}`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{formattedAmount}</p>
        </div>
    );
};

export const WalletPage: React.FC = () => {
    const { t } = useI18n();
    const { data: wallet, isLoading, isError } = useWallet();
    const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

    if (isLoading) {
        return <div className="w-full flex justify-center py-20"><Spinner /></div>;
    }

    if (isError || !wallet) {
        return <p className="p-8 text-center text-destructive">Could not load wallet.</p>;
    }

    return (
        <>
            <div className="container mx-auto py-12 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">{t('wallet.title')}</h1>
                    <Button onClick={() => setIsTopupModalOpen(true)}>{t('wallet.topup.cta')}</Button>
                </div>

                <Card className="mb-8">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BalanceCard label={t('wallet.balance.total')} amount={wallet.balance} currency={wallet.currency} className="bg-blue-50" />
                        <BalanceCard label={t('wallet.balance.available')} amount={wallet.available} currency={wallet.currency} className="bg-green-50" />
                        <BalanceCard label={t('wallet.balance.locked')} amount={wallet.locked} currency={wallet.currency} className="bg-orange-50" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('wallet.transactions.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransactionList transactions={wallet.transactions} />
                    </CardContent>
                </Card>
            </div>
            {isTopupModalOpen && (
                <TopupModal onClose={() => setIsTopupModalOpen(false)} />
            )}
        </>
    );
};

export default WalletPage;