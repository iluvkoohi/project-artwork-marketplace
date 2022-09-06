import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { ColorModeScript } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';



const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  //  <StrictMode>
  <RecoilRoot>
    <BrowserRouter>
      <ChakraProvider>
        <ColorModeScript />
        <App />
      </ChakraProvider>
    </BrowserRouter>
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
