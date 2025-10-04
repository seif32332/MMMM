import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useDeals } from '../../hooks/useDeals';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { FilterSidebar } from '../../components/marketplace/FilterSidebar';
import { DealCard } from '../../components/deals/DealCard';
import { useUser } from '../../stores/authStore';
import { UserPrimaryRole } from '../../types';

export const DealsListPage: React.FC = () => {
    const { t } = useI18n();
    const user = useUser();
    // TODO: Connect filters state to useDeals hook
    const { data: deals, isLoading, isError } = useDeals();

    const handleApplyFilters = (filters: any) => {
        console.log('Applying filters:', filters);
        // Set state and re-trigger useDeals hook
    };

    const canCreateDeal = user?.profile?.primaryRole === UserPrimaryRole.FOUNDER;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('deals.title')}</h1>
                {canCreateDeal && (
                    <Link to="/deals/new">
                        <Button>{t('deals.create.title')}</Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                <aside className="col-span-1">
                    <FilterSidebar onApplyFilters={handleApplyFilters} />
                </aside>
                <main className="col-span-3">
                    {isLoading && <div className="text-center py-16"><Spinner /></div>}
                    {isError && <p className="text-destructive text-center">{t('marketplace.loading')}</p>}
                    {deals && deals.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                        </div>
                    )}
                     {deals && deals.length === 0 && (
                        <p className="text-center text-gray-500 py-16">{t('marketplace.empty.deals')}</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DealsListPage;