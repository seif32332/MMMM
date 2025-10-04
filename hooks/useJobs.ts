import { useQuery } from '@tanstack/react-query';
import * as jobService from '../services/jobService';
import { Job } from '../types';

interface JobsFilters {
  companyId?: string;
  // Add other potential filters here
}

/**
 * A hook to fetch a list of jobs, with optional filters.
 * @param filters - An object containing filter criteria like companyId.
 */
export const useJobs = (filters: JobsFilters = {}) => {
  const queryKey = ['jobs', filters];

  return useQuery<Job[], Error>({
    queryKey,
    queryFn: () => jobService.getJobs(filters),
  });
};