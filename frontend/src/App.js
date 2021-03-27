import React, { useEffect, Suspense, lazy } from 'react';
import { useDispatch, Provider } from 'react-redux';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from './components/Auth/routes/PrivateRoute';
import PublicRoute from './components/Auth/routes/PublicRoute';
import getUserLoginStatus from './components/Auth/utils/getUserLoginStatus';

import store from './redux/store';
import Spinner from './widgets/spinner';

function App() {
  const Screen = lazy(() => import('./components/DataManagementScreen'));
  // const SignInScreen = lazy(() => import('./components/Auth/SignInScreen'));
  const SignUpScreen = lazy(() => import('./components/Auth/SignUpScreen'));
  // const SnippetDetailScreen = lazy(() => import('./components/SnippetDetailScreen'));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserLoginStatus());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <PublicRoute path="/email-not-verified" restricted component={SignUpScreen} />
            <PublicRoute path="/signin" restricted component={SignUpScreen} />
            <PublicRoute path="/signup" restricted component={SignUpScreen} />
            <PrivateRoute path="/dashboard" component={Screen} />
            <PrivateRoute exact path="/" component={Screen} />
            {/* <PrivateRoute path="/snippet-:snippetID" component={SnippetDetailScreen} /> */}
          </Switch>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
