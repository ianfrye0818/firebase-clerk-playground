import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import the layouts
import RootLayout from './layouts/RootLayout';

// Import the components
import Home from './pages/home/page';
import { SignIn, SignUp } from '@clerk/clerk-react';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/signin',
        element: (
          <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <SignIn />
          </div>
        ),
      },
      {
        path: '/signup',
        element: (
          <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <SignUp />
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
