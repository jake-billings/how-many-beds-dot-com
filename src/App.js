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
import {BedForm} from './forms.js'

function App () {
  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand bg="dark">HowManyBeds.com</Navbar.Brand>
      </Navbar>
      <Router>
        <Switch>
          <Route path="/hospitals">
            <HospitalsView/>
          </Route>
          <Route path="/hospital">
            <BedForm/>
          </Route>
          <Redirect to="/hospitals"/>
        </Switch>
      </Router>
    </>
  )
}

export default App
