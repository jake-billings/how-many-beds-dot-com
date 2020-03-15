import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
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
        </Switch>
      </Router>
    </>
  )
}

export default App
