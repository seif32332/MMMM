import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useDeal } from '../../hooks/useDeal';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FundDealModal } from '../../components/deals/FundDealModal';
import { useStartConversation } from '../../hooks/useStartConversation';
import { useToast } from '../../context/ToastContext';

const DetailItem: React.FC<{ labelKey: any; value: string }> = ({ labelKey, value }) => {
    const { t } = useI18n();
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-500">{t(labelKey)}</h3>
            <p className="text-md text-gray-800">{value}</p>
        </div>
    );
}

export const DealDetailPage: React.FC = () => {
    const { dealId } = useParams<{ dealId: string }>();
    const { t } = useI18n();
    const { data: deal, isLoading, isError } = useDeal(dealId);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const startConversationMutation = useStartConversation();
    const { showToast } = useToast();

    if (isLoading) {
        return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (isError || !deal) {
        return <div className="p-8 text-center text-destructive">Could not load the deal.</div>;
    }

    const handleMessageFounder = () => {
        startConversationMutation.mutate(deal.owner.id, {
            onError: (error) => showToast(error.message, 'error')
        });
    };

    return (
        <>
            <div className="container mx-auto py-12 px-4 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{deal.title}</CardTitle>
                        <CardDescription>
                            {t('deals.details.postedBy')} <Link to={`/u/${deal.owner.username}`} className="text-primary hover:underline">{deal.owner.fullName}</Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap mb-8">{deal.summary}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem labelKey="deals.details.fundingStage" value={deal.stage} />
                            <DetailItem labelKey="deals.details.fundingRange" value={`$${deal.amountMin.toLocaleString()} - $${deal.amountMax.toLocaleString()}`} />
                            <DetailItem labelKey="deals.details.industry" value={deal.industry} />
                            <DetailItem labelKey="deals.details.location" value={deal.country} />
                        </div>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" onClick={() => setIsFundModalOpen(true)}>
                                {t('deals.fund.title')}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleMessageFounder}
                                disabled={startConversationMutation.isPending}
                            >
                                {startConversationMutation.isPending ? <Spinner size="sm" /> : t('deals.details.messageFounder')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isFundModalOpen && (
                <FundDealModal
                    deal={deal}
                    onClose={() => setIsFundModalOpen(false)}
                />
            )}
        </>
    );
};

export default DealDetailPage;