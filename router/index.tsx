import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { OnboardingCompleteGuard } from './OnboardingCompleteGuard';
import { OnboardingInProgressGuard } from './OnboardingInProgressGuard';
import { AdminRoute } from './AdminRoute';

import { AppShell } from '../components/layout/AppShell';
import { Spinner } from '../components/ui/Spinner';

// Use a Suspense wrapper for lazy-loaded components
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner /></div>}>
    {children}
  </Suspense>
);

// --- Lazy-loaded Page Components ---

// Public
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));

// Onboarding
const OnboardingRolePage = lazy(() => import('../pages/onboarding/OnboardingRolePage'));
const OnboardingDetailsPage = lazy(() => import('../pages/onboarding/OnboardingDetailsPage'));
const OnboardingPreferencesPage = lazy(() => import('../pages/onboarding/OnboardingPreferencesPage'));
const OnboardingDonePage = lazy(() => import('../pages/onboarding/OnboardingDonePage'));


// App (Authenticated)
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const FeedPage = lazy(() => import('../pages/feed/FeedPage'));
const MessagesPage = lazy(() => import('../pages/messages/MessagesPage'));
const ChatWindow = lazy(() => import('../components/messages/ChatWindow'));
const ConversationPlaceholder = lazy(() => import('../pages/messages/ConversationPlaceholder'));
const MatchPage = lazy(() => import('../pages/match/MatchPage'));

// Profiles & Companies
const UserProfilePage = lazy(() => import('../pages/profiles/UserProfilePage'));
const UserProfileEditPage = lazy(() => import('../pages/profiles/UserProfileEditPage'));
const CompanyProfilePage = lazy(() => import('../pages/companies/CompanyProfilePage'));
const CompanyCreatePage = lazy(() => import('../pages/companies/CompanyCreatePage'));

// Marketplace
const DealsListPage = lazy(() => import('../pages/deals/DealsListPage'));
const DealDetailPage = lazy(() => import('../pages/deals/DealDetailPage'));
const DealCreatePage = lazy(() => import('../pages/deals/DealCreatePage'));
const JobsListPage = lazy(() => import('../pages/jobs/JobsListPage'));
const JobDetailPage = lazy(() => import('../pages/jobs/JobDetailPage'));
const JobCreatePage = lazy(() => import('../pages/jobs/JobCreatePage'));

// Wallet
const WalletPage = lazy(() => import('../pages/wallet/WalletPage'));

// System
const NotFoundPage = lazy(() => import('../pages/system/NotFoundPage'));

export const router = createBrowserRouter([
  // Public routes (don't use the AppShell with auth logic)
  {
    element: (
        <div>
            {/* Minimal layout for public pages */}
            <Outlet />
        </div>
    ),
    children: [
      {
        path: '/',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: '/auth/register',
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
      },
      {
        path: '/auth/verify-email',
        element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper>,
      },
    ],
  },

  // Authenticated routes (use the AppShell with auth logic and guards)
  {
    element: <AppShell />,
    errorElement: <NotFoundPage />, // You can add a specific error boundary here
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          // Onboarding Flow
          {
            element: <OnboardingInProgressGuard />,
            children: [
              { path: '/onboarding/role', element: <SuspenseWrapper><OnboardingRolePage /></SuspenseWrapper> },
              { path: '/onboarding/details', element: <SuspenseWrapper><OnboardingDetailsPage /></SuspenseWrapper> },
              { path: '/onboarding/preferences', element: <SuspenseWrapper><OnboardingPreferencesPage /></SuspenseWrapper> },
              { path: '/onboarding/done', element: <SuspenseWrapper><OnboardingDonePage /></SuspenseWrapper> },
            ]
          },
          // Main App (requires onboarding to be complete)
          {
            element: <OnboardingCompleteGuard />,
            children: [
              { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
              { path: '/feed', element: <SuspenseWrapper><FeedPage /></SuspenseWrapper> },
              { path: '/match', element: <SuspenseWrapper><MatchPage /></SuspenseWrapper> },
              
              // Profiles & Companies
              { path: '/u/:username', element: <SuspenseWrapper><UserProfilePage /></SuspenseWrapper> },
              { path: '/u/:username/edit', element: <SuspenseWrapper><UserProfileEditPage /></SuspenseWrapper> },
              { path: '/companies/new', element: <SuspenseWrapper><CompanyCreatePage /></SuspenseWrapper> },
              { path: '/companies/:slug', element: <SuspenseWrapper><CompanyProfilePage /></SuspenseWrapper> },
              
              // Marketplace
              { path: '/deals', element: <SuspenseWrapper><DealsListPage /></SuspenseWrapper> },
              { path: '/deals/new', element: <SuspenseWrapper><DealCreatePage /></SuspenseWrapper> },
              { path: '/deals/:dealId', element: <SuspenseWrapper><DealDetailPage /></SuspenseWrapper> },
              { path: '/jobs', element: <SuspenseWrapper><JobsListPage /></SuspenseWrapper> },
              { path: '/jobs/new', element: <SuspenseWrapper><JobCreatePage /></SuspenseWrapper> },
              { path: '/jobs/:jobId', element: <SuspenseWrapper><JobDetailPage /></SuspenseWrapper> },

              // Wallet
              { path: '/wallet', element: <SuspenseWrapper><WalletPage /></SuspenseWrapper> },

              // Messaging
              {
                path: '/messages',
                element: <SuspenseWrapper><MessagesPage /></SuspenseWrapper>,
                children: [
                    { index: true, element: <SuspenseWrapper><ConversationPlaceholder /></SuspenseWrapper> },
                    { path: ':conversationId', element: <SuspenseWrapper><ChatWindow /></SuspenseWrapper> }
                ]
              },
            ],
          },
          // Admin Routes
          {
            element: <AdminRoute />,
            children: [
                // Add admin routes here
            ]
          }
        ],
      },
    ],
  },
  
  // Catch-all for 404
  {
      path: '*',
      element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>
  }
]);