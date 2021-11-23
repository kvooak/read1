import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import PrivateRoute from './components/Auth/routes/PrivateRoute';
import PublicRoute from './components/Auth/routes/PublicRoute';

import PageStore from './components/Document/PageStore';
import store from './redux/store';
import themeJSON from './theme.json';

const theme = createTheme(themeJSON);

function App() {
  const DocumentScreen = lazy(() => import('./components/Document/DocumentScreen'));

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Suspense fallback={null}>
            <Switch>
              <PageStore>
                <PublicRoute path="/" component={DocumentScreen} />
              </PageStore>
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
