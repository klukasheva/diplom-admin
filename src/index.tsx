import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {MainStore} from "./stores/mainStore";
import {Provider} from "mobx-react";
import {ModalStore} from "./stores/modalStore";

const stores = {
    MainStore
}

export const ModalContext = createContext<ModalStore| null>(null)

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Provider {...stores}>
              <ModalContext.Provider value={new ModalStore()}>
                  <App />
              </ModalContext.Provider>
          </Provider>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
