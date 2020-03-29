import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect,
} from 'react-router-dom'

import HospitalsView from './HospitalsView'
import CreateHospitalView from './CreateHospitalView'
import EditHospitalView from './EditHospitalView'
import SignInView from './SignInView'
import AdminUserView from './AdminUserView'

function App () {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/hospitals/new" component={CreateHospitalView}/>
          <Route exact path="/hospitals/:hospitalId" component={EditHospitalView}/>
          <Route exact path="/hospitals" component={HospitalsView}/>
          <Route exact path="/sign-in" component={SignInView}/>
          <Route exact path="/admin/users" component={AdminUserView}/>
          <Redirect to="/hospitals"/>
        </Switch>
      </Router>
    </>
  )
}

export default App
