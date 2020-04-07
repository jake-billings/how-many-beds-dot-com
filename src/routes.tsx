import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import HospitalsView from './views/HospitalsView';
import CreateHospitalView from './views/CreateHospitalView';
import EditHospitalView from './views/EditHospitalView';
import SignInView from './views/SignInView';
import AdminUserView from './views/AdminUserView';
import FirebaseAuthProvider from './providers/FirebaseAuth';

function App(): JSX.Element {
  return (
    <FirebaseAuthProvider>
      <Router>
        <Switch>
          <Route exact path="/hospitals/new" component={CreateHospitalView} />
          <Route exact path="/hospitals/:hospitalId" component={EditHospitalView} />
          <Route exact path="/hospitals" component={HospitalsView} />
          <Route exact path="/sign-in" component={SignInView} />
          <Route exact path="/admin/users" component={AdminUserView} />
          <Redirect to="/hospitals" />
        </Switch>
      </Router>
    </FirebaseAuthProvider>
  );
}

export default App;
