import React, { lazy, StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import Wrapper from './wrapper';
import "./index.css";
import { Profile } from './controllers/profile';
import { ColorModeScript, Flex, Spinner } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminTickets from './pages/admin/tickets';
import PageCustomerLogin from './pages/customer/account/login';
import PageCustomerRegistration from './pages/customer/account/registration';
import PageCustomerMain from './pages/customer/customer_main';
import PageCustomerCreateProfile from './pages/customer/customer_create_profile';

const renderLoader = () => {
  return <Flex height={"100vh"} justify={"center"} alignItems={"center"}>
    <Spinner size='xl' />
  </Flex>;
}
const PageLogin = lazy(() => import('./pages/account/login'));
const PageRegistration = lazy(() => import('./pages/account/registration'));
const PageArtistMain = lazy(() => import('./pages/artist/artist_main'));
const PageEditProfile = lazy(() => import('./pages/artist/artist_create_profile'));
const PageUpdateProfile = lazy(() => import('./pages/artist/artist_update_profile'));
const PageArtistArtwork = lazy(() => import('./pages/artist/artist_artworks'));


const profileController = new Profile();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Wrapper>
      <PageLogin />
    </Wrapper>,
    errorElement: <h1>Page not found</h1>,

  },
  {
    path: "/registration",
    element: <Wrapper>
      <PageRegistration />
    </Wrapper>,
  },
  {
    path: "/customer/login",
    element: <PageCustomerLogin />,
    errorElement: <h1>Page not found</h1>,

  },
  {
    path: "/customer/registration",
    element: <PageCustomerRegistration />,
  },

  {
    path: "/customer/main",
    element: <PageCustomerMain />,
    loader: async () => {
      const response = await profileController.get();
      return response;
    }
  },
  {
    path: "/customer/profile/create",
    element: <PageCustomerCreateProfile />,
  },


  {
    path: "/artist/main",
    element: <Wrapper>
      <PageArtistMain />
    </Wrapper>,
    loader: async () => {
      const response = await profileController.get();
      return response;
    }
  },
  {
    path: "/artist/artwork",
    element: <Wrapper>
      <PageArtistArtwork />
    </Wrapper>,
    loader: async () => {
      const response = await profileController.get();
      return response;
    }
  },
  {
    path: "/artist/profile/create",
    element: <Wrapper>
      <PageEditProfile />
    </Wrapper>,
    loader: async () => { }
  },
  {
    path: "/artist/profile/update",
    element: <Wrapper>
      <PageUpdateProfile />
    </Wrapper>,
    loader: async () => { }
  },
  {
    path: "/admin/tickets",
    element: <AdminTickets />,
  },
]);

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    //<StrictMode>
    <RecoilRoot>
      <Suspense fallback={renderLoader()}>
        <ChakraProvider>
          <ColorModeScript />
          <RouterProvider router={router} />
        </ChakraProvider>
      </Suspense>
    </RecoilRoot>
    // </StrictMode >
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
