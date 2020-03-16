import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect,
} from 'react-router-dom'
import HospitalsView from './HospitalsView'
import Navbar from 'react-bootstrap/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateHospitalView from './CreateHospitalView'
import EditHospitalView from './EditHospitalView'

function App () {
  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand bg="dark">HowManyBeds.com</Navbar.Brand>
      </Navbar>
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
