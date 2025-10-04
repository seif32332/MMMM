
import React, { Component, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { en } from '../i18n/en';
import { TranslationKey } from '../types';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// A safe translation function that only uses English as a fallback.
// This prevents errors if the fallback UI renders outside of the I18nProvider context.
const t = (key: TranslationKey): string => {
  return en[key] || String(key);
}

// Fallback component to be rendered when an error is caught.
const ErrorFallback = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle>{t('error.fallback.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">{t('error.fallback.message')}</p>
                    <Button onClick={() => window.location.reload()}>
                        Refresh Page
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}