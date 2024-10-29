import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PageLayout from '../layout/PageLayout'

import Login from '../pages/auth/Login'
import ChangePassword from '../pages/auth/ChangePassword'
import ResetPassword from '../pages/auth/ResetPassword'
import DashboardLayout from '../layout/DashboardLayout'
import Dashboard from '../pages/dashboard'
import Referrals from '../pages/dashboard'

const Routers = () => {
  return (
    <Routes>
        <Route element={<PageLayout />}>
            <Route path='/' element={<Login />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
   
        <Route element={<DashboardLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/details' element={<Referrals />} />
        </Route>
    
    </Routes>
  )
}

export default Routers