import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect,
} from 'react-router-dom'

import HospitalsView from './HospitalsView'
import CreateHospitalView from './CreateHospitalView'
import EditHospitalView from './EditHospitalView'

function App () {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/hospitals/new" component={CreateHospitalView}/>
          <Route exact path="/hospitals/:hospitalId" component={EditHospitalView}/>
          <Route exact path="/hospitals" component={HospitalsView}/>
          <Redirect to="/hospitals"/>
        </Switch>
      </Router>
    </>
  )
}

export default App
