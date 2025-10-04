import { useQuery } from '@tanstack/react-query';
import * as dealService from '../services/dealService';
import { Deal } from '../types';

/**
 * A hook to fetch the details of a single deal by its ID.
 * @param dealId The ID of the deal to fetch.
 */
export const useDeal = (dealId: string | undefined) => {
  return useQuery<Deal, Error>({
    queryKey: ['deal', dealId],
    queryFn: () => {
      if (!dealId) {
        throw new Error('Deal ID is required');
      }
      return dealService.getDealById(dealId);
    },
    enabled: !!dealId, // The query will not run until the dealId is available
  });
};