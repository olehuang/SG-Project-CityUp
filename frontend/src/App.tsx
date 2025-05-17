import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Routes,Route,BrowserRouter } from 'react-router-dom';

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />}  path="/" />{/*HomePage*/}
          <Route element={<DashboardLayout/> }  >{/*DashboardLayout*/}
             <Route element={<DashboardPage/>} path="/dashboard" />{/*DashboardPage*/}
          </Route>{/*DashboardLayout*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
