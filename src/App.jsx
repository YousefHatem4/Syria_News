import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import AboutUs from './Components/AboutUs/AboutUs'
import AdminProfile from './Components/AdminProfile/AdminProfile'
import ContactUs from './Components/ContactUs/ContactUs'
import ForgetPass from './Components/ForgetPass/ForgetPass'
import NewPass from './Components/NewPass/NewPass'
import NewsDetails from './Components/NewsDetails/NewsDetails'
import Profile from './Components/Profile/Profile'
import VerfiyCode from './Components/VerfiyCode/VerfiyCode'
import UserContextProvider from './Components/Context/userContext'
import { Toaster } from 'react-hot-toast'
import MoreNews from './Components/MoreNews/MoreNews'

// ✅ Define Base URL here
export const BASE_URL = "https://newssyriabackend-newsyria.up.railway.app/api/v1/";

const routers = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "aboutus", element: <AboutUs /> },
      { path: "adminprofile", element: <AdminProfile /> },
      { path: "contactus", element: <ContactUs /> },
      { path: "forgetpass", element: <ForgetPass /> },
      { path: "newpass", element: <NewPass /> },
      { path: "newsdetails", element: <NewsDetails /> },
      { path: "profile", element: <Profile /> },
      { path: "verfiycode", element: <VerfiyCode /> },
      { path: "more-news", element: <MoreNews /> },

    ]
  }
])

function App() {

  return <>
    <UserContextProvider>
      <RouterProvider router={routers}></RouterProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </UserContextProvider>
  </>
}

export default App
