import { useQuery } from '@tanstack/react-query';
import * as dealService from '../services/dealService';
import { Deal } from '../types';

interface DealsFilters {
  ownerId?: string;
  companyId?: string;
  // Add other potential filters here
}

/**
 * A hook to fetch a list of deals, with optional filters.
 * @param filters - An object containing filter criteria like ownerId or companyId.
 */
export const useDeals = (filters: DealsFilters = {}) => {
  // The query key includes a stable representation of the filters
  // so that the query is re-fetched when filters change.
  const queryKey = ['deals', filters];

  return useQuery<Deal[], Error>({
    queryKey,
    queryFn: () => dealService.getDeals(filters),
  });
};