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
import { withRouter } from 'react-router';

import saga from './saga';
import { logout } from './actions';

import AppWrapper from '../../components/AppWrapper/index';
import Dashboard from '../../components/Dashboard';

import LandingPage from '../../components/LandingPage';
import NotFound from 'containers/NotFoundPage';


function PrivateRoute({ component: Component, isLoggedIn,...rest }) {
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
          )}
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
          )}
      }
    />
  );
}

// tslint:disable-next-line:no-empty-interface
interface OwnProps {}

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
    <AppWrapper isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <PublicRoute exact path="/" component={LandingPage} isLoggedIn={isLoggedIn} />
      <PrivateRoute path="/dashboard" component={Dashboard} isLoggedIn={isLoggedIn} />
      <Route component={NotFound} />
    </AppWrapper>
  );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.getIn(['global', 'loggedIn']),
})

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => {
    dispatch(logout());
  },
});

//export default connect(mapStateToProps, mapDispatchToProps)(App);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({ key: 'route', saga: saga });

export default compose<TRouter, TSaga, TConnect, ReturnType>(
  withRouter,
  withSaga,
  withConnect,
)(App);

type ReturnType = React.ComponentType<OwnProps>;
type TRouter = ReturnType;
type TSaga = ReturnType;
type TConnect = typeof App;
