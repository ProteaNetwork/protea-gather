/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import { compose } from 'redux';
import { withRouter, Switch } from 'react-router';

import saga from './saga';
import { logout } from './actions';

import AppWrapper from '../../components/AppWrapper/index';
import Dashboard from '../../components/Dashboard';
import { DAEMON } from 'utils/constants';
import LandingPage from 'components/LandingPage';

function PrivateRoute({ component: Component, isLoggedIn, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
      }
    />
  );
}

function PublicRoute({ component: Component, isLoggedIn, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return !isLoggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/dashboard",
                state: { from: props.location }
              }}
            />
          )
      }
      }
    />
  );
}


interface OwnProps { }

interface StateProps {
  isLoggedIn: boolean;
  currentlySending: boolean;
}

interface DispatchProps {
  onLogout();
}

type Props = StateProps & DispatchProps & OwnProps;
function App(props: Props) {
  const { isLoggedIn, onLogout, currentlySending } = props;

  // The PublicRoute and PrivateRoute components below should only be used for top level components
  // that will be connected to the store, as no props can be passed down to the child components from here.
  return (
    <AppWrapper isLoggedIn={isLoggedIn} onLogout={onLogout} name='' ensName='' tokenBalance={1} image=''>
      <Switch>
        <Route path="/" component={LandingPage} />
      </Switch>
    </AppWrapper>
  );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.global.loggedIn,
  currentlySending: state.global.currentlySending,
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => {
    dispatch(logout());
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({ key: 'global', saga: saga, mode: DAEMON });

export default compose(
  withRouter,
  withSaga,
  withConnect,
)(App);
