import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import App from './App';
import { router } from './router';

// The root component that integrates all providers and the router.
const Root = () => (
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);

createRoot(document.getElementById('root')!).render(<Root />);
