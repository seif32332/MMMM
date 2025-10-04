import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Header } from '../../components/Header';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
       <Header />
       <main className="flex items-center justify-center py-20">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl mb-4">Page Not Found</p>
                    <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
                    <Link to="/">
                        <Button>Go to Homepage</Button>
                    </Link>
                </CardContent>
            </Card>
       </main>
    </div>
  );
};

export default NotFoundPage;