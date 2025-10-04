import { useQuery } from '@tanstack/react-query';
import * as jobService from '../services/jobService';
import { Job } from '../types';

/**
 * A hook to fetch the details of a single job by its ID.
 * @param jobId The ID of the job to fetch.
 */
export const useJob = (jobId: string | undefined) => {
  return useQuery<Job, Error>({
    queryKey: ['job', jobId],
    queryFn: () => {
      if (!jobId) {
        throw new Error('Job ID is required');
      }
      return jobService.getJobById(jobId);
    },
    enabled: !!jobId,
  });
};