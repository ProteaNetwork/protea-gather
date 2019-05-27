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
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';

import { DAEMON } from 'utils/constants';

import { forwardTo } from 'utils/history';
import AppWrapper from '../../components/AppWrapper/index';
import { logOut } from '../../domain/authentication/actions';
import routes from './routes';
import saga from './saga';
import selectApp from './selectors';
import { RootState } from './types';
import TxLoadingModal from 'components/TxLoadingModal';
import { setQrAction } from 'domain/transactionManagement/actions';

const PrivateRoute: React.SFC<any> = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/',
                state: { from: props.location },
              }}
            />
          );
      }
      }
    />
  );
};

const PublicRoute: React.SFC<any> = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return !isLoggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/dashboard',
                state: { from: props.location },
              }}
            />
          );
      }
      }
    />
  );
};

interface OwnProps { }

interface StateProps {
  isLoggedIn: boolean;
  ethAddress: string;
  profileImage: string;
  displayName: string;
  txPending: boolean;
  txRemaining: number;
  txContext: string;
  networkReady: boolean;
  networkId: number;
  qrData:string;
  daiBalance: number
}

interface DispatchProps {
  onLogout();
  onCloseQr(): void;
}

type Props = StateProps & DispatchProps & OwnProps;
const App: React.SFC<Props> = (props: Props) => {
  const { onCloseQr, qrData, networkReady, networkId, isLoggedIn, ethAddress, displayName, profileImage, onLogout, txPending, txRemaining, txContext, daiBalance } = props;
  return (
    <AppWrapper
      onLogout={onLogout}
      isLoggedIn={isLoggedIn}
      displayName={displayName}
      daiBalance={daiBalance}
      ethAddress={ethAddress}
      profileImage={profileImage}
      navLinks={routes.filter(r => r.isNavRequired)}
      networkId={networkId}
      networkReady={networkReady}
      >
      <TxLoadingModal qrData={qrData} pendingTx={txPending} txRemaining={txRemaining} txContext={txContext} onCloseQr={onCloseQr} ></TxLoadingModal>
      <Switch>
        {routes.map(r => {
          const route = (r.isProtected) ?
            (<PrivateRoute path={r.path} exact component={r.component} isLoggedIn={isLoggedIn} key={r.path} />) :
            (<PublicRoute path={r.path} exact component={r.component} isLoggedIn={isLoggedIn} key={r.path} />);
          return route;
        })}
      </Switch>
    </AppWrapper>
  );
};

const mapStateToProps = state => selectApp(state);

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => {
    dispatch(logOut());
    forwardTo('/');
  },
  onCloseQr: () => {
    dispatch(setQrAction(''))
  }
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
