import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import the layouts
import RootLayout from './layouts/RootLayout';

// Import the components
import Home from './pages/home/Home';
// import SignInPage from './pages/signin/SignIn';
// import SignUpPage from './pages/signup/SignUp';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{ path: '/', element: <Home /> }],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
