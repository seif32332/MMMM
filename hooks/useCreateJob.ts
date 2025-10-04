import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import * as jobService from '../services/jobService';
import { Job, Company } from '../types';

type CreateJobPayload = Omit<Job, 'id' | 'createdAt' | 'company'>;
type UseCreateJobOptions = Omit<UseMutationOptions<Job, Error, CreateJobPayload>, 'mutationFn'>;

// FIX: Update the `company` parameter type to include `ownerId` to match the `jobService.createJob` function signature.
export const useCreateJob = (company: Pick<Company, 'id' | 'name' | 'slug' | 'logoUrl' | 'ownerId'> | undefined, options?: UseCreateJobOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, CreateJobPayload>({
    ...options,
    mutationFn: (jobData) => {
      if (!company) {
        throw new Error('A company must be associated to post a job.');
      }
      return jobService.createJob(jobData, company);
    },
    onSuccess: (newJob, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      options?.onSuccess?.(newJob, variables, context, mutation);
    },
  });
};
