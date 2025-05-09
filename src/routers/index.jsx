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
import EditOrgs from '../pages/orgs/components/EditOrgs'
import AddIndividual from '../pages/referrals/components/AddIndividual'
import EditIndividual from '../pages/referrals/components/EditIndividual'
import EditAppointment from '../pages/appointments/component/EditAppointment'
import Settings from '../pages/settings'
import ProtectRoute from './ProtectRoute'
import Kols from '../pages/kol'
import AddKols from '../pages/kol/components/AddKols'
import EditKols from '../pages/kol/components/EditKols'


const Routers = () => {
  return (
    <Routes>
        <Route element={<PageLayout />}>
            <Route path='/' element={<Login />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
   
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<ProtectRoute><Dashboard /></ProtectRoute>} />
          <Route path='/appointments' element={<ProtectRoute><Appointments /></ProtectRoute>} />
          <Route path='/individuals' element={<ProtectRoute><Referrals /></ProtectRoute>} />
          <Route path='/referrals/details' element={<ProtectRoute><ReferralDetails /></ProtectRoute>} />
          <Route path='/settings' element={<ProtectRoute><Settings /></ProtectRoute>} />
          <Route path='/orgs/add' element={<ProtectRoute><AddOrgs /></ProtectRoute>} />
          <Route path='/orgs/edit' element={<ProtectRoute><EditOrgs /></ProtectRoute>} />
          <Route path='/kols/add' element={<ProtectRoute><AddKols /></ProtectRoute>} />
          <Route path='/kols/edit' element={<ProtectRoute><EditKols /></ProtectRoute>} />
          <Route path='/individuals/add' element={<ProtectRoute><AddIndividual /></ProtectRoute>} />
          <Route path='/individuals/edit' element={<ProtectRoute><EditIndividual /></ProtectRoute>} />
          <Route path='/appointment/edit' element={<ProtectRoute><EditAppointment /></ProtectRoute>} />
          <Route path='/orgs' element={<ProtectRoute><Orgs /></ProtectRoute>} />
          <Route path='/kols' element={<ProtectRoute><Kols /></ProtectRoute>} />
          <Route path='/reward-request' element={<ProtectRoute><RewardRequest /></ProtectRoute>} />
          <Route path='/client/details' element={<ProtectRoute><Details /></ProtectRoute>} />
        </Route>
    
    </Routes>
  )
}

export default Routers