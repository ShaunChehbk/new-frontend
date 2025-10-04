import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthProvider';
import { ContainerHeightProvider } from './context/ContainerHeightProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './Home';
import reportWebVitals from './reportWebVitals';
import { APIProvider } from './context/APIProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      {/* <APIProvider> */}
          <ContainerHeightProvider>
            <Routes>
              <Route path='/*' element={<Home />} />
            </Routes>
          </ContainerHeightProvider>
      {/* </APIProvider> */}
    </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
