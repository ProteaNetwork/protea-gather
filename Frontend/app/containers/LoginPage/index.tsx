/**
 *
 * LoginPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import Login from 'components/Login';
import { Formik } from 'formik';
import { toggleAuth } from 'containers/App/actions';

// tslint:disable-next-line:no-empty-interface
interface OwnProps {

}

// tslint:disable-next-line:no-empty-interface
interface DispatchProps {
  toggleLogin(): void;
}

// tslint:disable-next-line:no-empty-interface
interface StateProps {

}

type Props = StateProps & DispatchProps & OwnProps;

const LoginPage: React.SFC<Props> = ({toggleLogin}: Props) => {
  return (
    <Formik
    initialValues={{ email: '', password: '' }}
    isInitialValid={false}
    onSubmit={() => {
      toggleLogin();
    }}
    render={({submitForm}) =>
      <Login
        error={''}
        isSubmitting={false}
        submitForm={submitForm} />}
  />
  );
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch: dispatch,
    toggleLogin: () => {
      dispatch(toggleAuth());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({ key: 'loginpage', reducer: reducer });
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
const withSaga = injectSaga<OwnProps>({ key: 'loginpage', saga: saga });

// export default withReducer(withSaga(withConnect(LoginPage))); // identical to compose function, but requires no explicit type declaration
export default compose<TReducer, TSaga, TConnect, ReturnType>(
  withReducer,
  withSaga,
  withConnect,
)(LoginPage);

type ReturnType = React.ComponentType<OwnProps>;
type TReducer = ReturnType;
type TSaga = ReturnType;
type TConnect = typeof LoginPage;


