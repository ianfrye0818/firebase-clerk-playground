//library imports
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

//custom imports
import { AuthContextProvider } from './context/FirebaseAuthContextProvider';

//route imports
import Home from './pages/home/page';
import SignIn from './pages/signin/page';
import SignUp from './pages/signup/page';

//app compoent that takes care of routing for firebase - currently not used as all routing is going through the main.tsx file with Clerk
export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signin',
      element: <SignIn />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    },
  ]);

  const queryClient = new QueryClient();

  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}
