import React from 'react';
import { WalletTx, TxKind, TxStatus, TranslationKey } from '../../types';
import { useI18n } from '../../i18n';

interface TransactionListProps {
    transactions: WalletTx[];
}

const TransactionRow: React.FC<{ tx: WalletTx }> = ({ tx }) => {
    const { t, locale } = useI18n();
    
    const isCredit = tx.amount > 0n;
    const amountColor = isCredit ? 'text-green-600' : 'text-red-600';

    const formattedAmount = (Number(tx.amount) / 100).toLocaleString(locale, {
        style: 'currency',
        currency: tx.currency,
        signDisplay: 'always',
    });

    const formattedDate = new Date(tx.createdAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    
    const kindKey: TranslationKey = `txKind.${tx.kind}` as TranslationKey;

    return (
        <div className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
            <div className="flex-grow">
                <p className="font-semibold">{t(kindKey)}</p>
                <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            <div className="text-right">
                <p className={`font-mono font-semibold ${amountColor}`}>{formattedAmount}</p>
                <p className="text-xs text-gray-500 capitalize">{tx.status.toLowerCase()}</p>
            </div>
        </div>
    );
};


export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    const { t } = useI18n();
    
    if (!transactions || transactions.length === 0) {
        return <p className="text-center text-gray-500 py-8">{t('wallet.transactions.empty')}</p>;
    }

    // Show newest first
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="divide-y">
            {sortedTransactions.map(tx => (
                <TransactionRow key={tx.id} tx={tx} />
            ))}
        </div>
    );
};
