import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import App from './App.jsx'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Desktop from './pages/Desktop'
import Menu from './pages/Menu'
import NotFound from './pages/404'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/desktop",
    element: <Desktop />
  },
  {
    path: "/menu",
    element: <Menu />
  },
  {
    path: "/*",
    element: <NotFound />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
