import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import store from './redux/store';
import Spinner from './widgets/spinner';

function App() {
  const Screen = lazy(() => import('./components/DataManagementScreen'));
  const SnippetDetailScreen = lazy(() => import('./components/SnippetDetailScreen'));

  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route exact path="/" component={Screen} />
            <Route path="/snippet-:snippetID" component={SnippetDetailScreen} />
          </Switch>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
