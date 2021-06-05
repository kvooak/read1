import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
// import PrivateRoute from './components/Auth/routes/PrivateRoute';
import PublicRoute from './components/Auth/routes/PublicRoute';

import store from './redux/store';

function App() {
  const DocumentScreen = lazy(() => import('./components/DocumentScreen'));

  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={null}>
          <Switch>
            <PublicRoute path="/" component={DocumentScreen} />
          </Switch>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
