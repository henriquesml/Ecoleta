import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import './App.css';
import Route from './routes';

function App() {
  return (
    <>
      <Route/>
      <ToastContainer autoClose={3000} />
    </>
  );
}

export default App;
