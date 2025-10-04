import { useMutation } from '@tanstack/react-query';
import * as authService from '../services/authService';
import { useUser } from '../stores/authStore';

export const useResendVerification = () => {
    const user = useUser();
    return useMutation<void, Error, void>({
        mutationFn: () => {
            if (!user?.email) {
                throw new Error("No email found to send verification to.");
            }
            return authService.resendVerificationEmail(user.email);
        }
    });
};
