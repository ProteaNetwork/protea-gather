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
import FontFaceObserver from 'fontfaceobserver';
import { Router } from 'react-router';
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions

import configureStore from './configureStore';
// import {loadState, saveState} from './utils/localStorage';
import history from './utils/history';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// import throttle from 'lodash/throttle';

const robotoObserver = new FontFaceObserver('Roboto', {});

// When Roboto is loaded, add a font-family using Roboto to the body
robotoObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}).catch(() => console.log('Error loading Roboto font'));

const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      paper: "#fff",
      default: "#fafafa"
    },
    primary: {
      main: '#f57c00',
    },
    secondary: {
      main: '#ffa000',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

// const persistedState = loadState();
// persistedState
const store = configureStore();

// store.subscribe(throttle(() => {
//   saveState(store.getState());
// }, 1000));

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
    // https://github.com/webpack/webpack-dev-server/issues/100
    const App = require('./containers/App').default;
    render(App);
  });
}

render();

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install();
}
