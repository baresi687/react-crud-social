import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home.jsx';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import Posts from './components/Posts.jsx';
import CreatePost from './components/CreatePost.jsx';
import Profile from './components/Profile.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import PostDetails from './components/PostDetails.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/posts',
        element: <Posts />,
      },
      {
        path: '/post-details/:id',
        element: <PostDetails />,
      },
      {
        path: '/create-post',
        element: <CreatePost />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
