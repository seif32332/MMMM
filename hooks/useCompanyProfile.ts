import { useQuery } from '@tanstack/react-query';
import * as companyService from '../services/companyService';
import { Company } from '../types';

/**
 * A hook to fetch a company's public profile data by its slug.
 * @param slug The unique slug of the company to fetch.
 */
export const useCompanyProfile = (slug: string | undefined) =>
  useQuery<Company, Error>({
    queryKey: ['companyProfile', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error('Slug is required to fetch a company profile.');
      }
      return companyService.getCompanyBySlug(slug);
    },
    enabled: !!slug, // The query will not run until the slug is available
  });