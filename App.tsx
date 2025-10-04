import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nProvider } from './i18n';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { queryClient } from './lib/queryClient';
import { ChatProvider } from './context/AuthContext';
import { MockChatAdapter } from './services/messageService';

const chatAdapter = new MockChatAdapter('user-1');

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <ChatProvider adapter={chatAdapter}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ChatProvider>
        </I18nProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
