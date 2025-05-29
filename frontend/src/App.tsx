import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Routes,Route,BrowserRouter,createBrowserRouter,createRoutesFromElements } from 'react-router-dom';

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import {AuthProvider} from "./components/AuthProvider";
import KeycloakClient from "./components/keycloak";
import Keycloakinit from "./components/Keycloakinit";
import ProtectedRouter from "./components/ProtectedRouter";
import Upload from "./components/Upload";
import Tutorial from "./components/Tutorial";
import BuildingInfo from "./components/BuildingInfo";
import UploadHistory from "./components/UploadHistory";
import ProductIntroduction from "./components/ProductIntroduction";
import PhotoReview from "./components/PhotoReview";


function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route element={<Keycloakinit />}>{/*KeycloakInit*/}
                    <Route element={<HomePage />}  path="/" />{/*HomePage*/}
                    <Route element={<ProtectedRouter />}>{/*ProtectedRouter*/}
                        <Route element={<DashboardLayout/> }  >{/*DashboardLayout*/}
                            <Route element={<DashboardPage/>} path="/dashboard" />{/*DashboardPage*/}
                            <Route element={<Upload/>} path="/dashboard/upload" />{/*UploadPage*/}
                            <Route element={<Tutorial/>} path="/dashboard/tutorial" />{/*Tutorial*/}
                            <Route element={<BuildingInfo/>} path="/dashboard/buildingInformation" />{/*Building Infomation*/}
                            <Route element={<UploadHistory/>} path="/dashboard/uploadHistory" />{/*Upload History*/}
                            <Route element={<ProductIntroduction/>} path="/dashboard/productIntroduction" />{/*Product Introduction*/}
                            <Route element={<PhotoReview/>} path="/dashboard/photoReview" />{/*Product Introduction*/}
                        </Route>{/*DashboardLayout*/}
                    </Route>{/*ProtectedRouter*/}
                </Route>{/*KeycloakInit*/}
            </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
