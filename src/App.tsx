//library imports
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { dark } from '@clerk/themes';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Home from './pages/home/Home';
import SignIn from './pages/signin/SignIn';
import { ClerkProvider } from '@clerk/clerk-react';

export default function App() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const PUBLISHED_KEY = 'pk_test_cHJvbXB0LXN0YXJsaW5nLTk4LmNsZXJrLmFjY291bnRzLmRldiQ';

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signin',
      element: <SignIn />,
    },
  ]);

  if (!PUBLISHED_KEY) {
    throw new Error('Missing Published Key');
  }

  return (
    <ClerkProvider
      navigate={navigate}
      publishableKey={PUBLISHED_KEY}
      appearance={{ baseTheme: dark }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
