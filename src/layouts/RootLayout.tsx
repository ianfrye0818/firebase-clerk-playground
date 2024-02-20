import { Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import SavedUsersProfile from '../components/UserProfile';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function RootLayout() {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      navigate={navigate}
      publishableKey={PUBLISHABLE_KEY}
    >
      <SavedUsersProfile>
        <header className='header'></header>
        <main>
          <Outlet />
        </main>
      </SavedUsersProfile>
    </ClerkProvider>
  );
}
