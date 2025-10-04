import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

const OnboardingDonePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically redirect to the dashboard after a short delay
        const timer = setTimeout(() => {
            navigate('/dashboard', { replace: true });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="text-center p-8">
                <CardHeader>
                    <CardTitle>Setup Complete!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">You're all set. Redirecting you to your dashboard...</p>
                    <Spinner />
                </CardContent>
            </Card>
        </div>
    );
};

export default OnboardingDonePage;