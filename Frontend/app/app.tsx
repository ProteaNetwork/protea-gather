/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions

import configureStore from './configureStore';
import {loadState, saveState} from './utils/localStorage';
import history from './utils/history';
// Import CSS reset and Global Styles
import './styles/global-styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Router } from 'react-router';
import throttle from 'lodash/throttle';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
  },
});

const persistedState = loadState();
const store = configureStore(persistedState);

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));

const MOUNT_NODE = document.getElementById('app') as HTMLElement;

const render = (Component = App) => {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Component />
        </Router>
      </MuiThemeProvider>
    </Provider>,
    MOUNT_NODE,
  );
};

declare const module: any;
if (module.hot) {
  module.hot.accept(['./containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    // tslint:disable-next-line:max-line-length
    const App = require('./containers/App').default; // https://github.com/webpack/webpack-dev-server/issues/100
    render(App);
  });
}

if (!window.Intl) {
  render();
} else {
  render();
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install();
}
