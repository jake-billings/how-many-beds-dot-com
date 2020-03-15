import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect,
} from 'react-router-dom'
import HospitalsView from './HospitalsView'

// import firebase from './firebase'

function App () {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/hospitals">
            <HospitalsView/>
          </Route>
          <Redirect to="/hospitals"/>
        </Switch>
      </Router>
    </>
  )
}

export default App
