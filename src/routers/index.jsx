import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PageLayout from '../layout/PageLayout'

import Login from '../pages/auth/Login'
import ChangePassword from '../pages/auth/ChangePassword'
import ResetPassword from '../pages/auth/ResetPassword'
import DashboardLayout from '../layout/DashboardLayout'
import Dashboard from '../pages/dashboard'
import Referrals from '../pages/referrals'
import Orgs from '../pages/orgs'
import RewardRequest from '../pages/reward'
import Appointments from '../pages/appointments'
import Details from '../components/Details'
import ReferralDetails from '../components/ReferralDetails'
import AddOrgs from '../pages/orgs/components/AddOrgs'
import AddIndividual from '../pages/referrals/components/AddIndividual'
import Settings from '../pages/settings'


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
            <Route path='/appointments' element={<Appointments />} />
            <Route path='/individuals' element={<Referrals />} />
            <Route path='/referrals/details' element={<ReferralDetails />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/orgs/add' element={<AddOrgs />} />
            <Route path='/individuals/add' element={<AddIndividual />} />
            <Route path='/orgs' element={<Orgs />} />
            <Route path='/reward-request' element={<RewardRequest />} />
            <Route path='/client/details' element={<Details />} />
        
        </Route>
    
    </Routes>
  )
}

export default Routers