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
import injectReducer from 'utils/injectReducer';
import { compose } from 'redux';
import { withRouter, Switch } from 'react-router';

import saga from './saga';
import { logout } from './actions';

import AppWrapper from '../../components/AppWrapper/index';

import LandingPage from '../../components/LandingPage';
import NotFound from 'containers/NotFoundPage';
import DashboardPage from 'containers/DashboardPage';
import CommunitiesPage from 'containers/CommunitiesPage';
import CommunityPage from 'containers/CommunityPage';
import EventsPage from 'containers/EventsPage';
import EventPage from 'containers/EventPage';
import reducer from './reducer';
import LoginPage from 'containers/LoginPage';

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
                pathname: "/",
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

// tslint:disable-next-line:no-empty-interface
interface OwnProps { }

// tslint:disable-next-line:no-empty-interface
interface StateProps {
  isLoggedIn: boolean;
}

interface DispatchProps {
  onLogout();
}

type Props = StateProps & DispatchProps & OwnProps;

function App(props: Props) {
  const { isLoggedIn, onLogout } = props;

  // The PublicRoute and PrivateRoute components below should only be used for top level components
  // that will be connected to the store, as no props can be passed down to the child components from here.
  return (
    <AppWrapper isLoggedIn={isLoggedIn} onLogout={onLogout} >
      <Switch>
        <Route exact path="/" component={LandingPage} isLoggedIn={isLoggedIn} />
        <PublicRoute path="/login" component={LoginPage} isLoggedIn={isLoggedIn} />
        <PrivateRoute path="/dashboard" component={DashboardPage} isLoggedIn={isLoggedIn} />
        <PrivateRoute path="/communities" component={CommunitiesPage} isLoggedIn={isLoggedIn} />
        <PrivateRoute path="/community" component={CommunityPage} isLoggedIn={isLoggedIn} />
        <PrivateRoute path="/events" component={EventsPage} isLoggedIn={isLoggedIn} />
        <PrivateRoute path="/event" component={EventPage} isLoggedIn={isLoggedIn} />
        <Route component={NotFound} />
      </Switch>
    </AppWrapper>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.global.loggedIn,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => {
    dispatch(logout());
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga<OwnProps>({ key: 'global', saga: saga });

export default compose<TRouter, TReducer, TSaga, TConnect, ReturnType>(
  withRouter,
  withReducer,
  withSaga,
  withConnect,
)(App);

type ReturnType = React.ComponentType<OwnProps>;
type TRouter = ReturnType;
type TReducer = ReturnType;
type TSaga = ReturnType;
type TConnect = typeof App;
