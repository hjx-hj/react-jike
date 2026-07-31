//路由配置
import Layout from '@/pages/Layout/index.jsx'
import Login from '@/pages/Login/index.jsx'
import { createHashRouter, HashRouter, Navigate } from 'react-router-dom'
import AuthRoute from '@/components/AuthRoute.jsx'
import Home from '@/pages/Home/index.jsx'
import Article from '@/pages/Article/index.jsx'
import Publish from '@/pages/Publish/index.jsx'

const router = createHashRouter([
  {
    path: '/',
    element: <AuthRoute><Layout />
    </AuthRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/home" />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/article',
        element: <Article />
      },
      {
        path: '/publish',
        element: <Publish />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router
