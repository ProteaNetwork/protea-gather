/**
 *
 * TransactionManagement
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTransactionManagement from './selectors';
import reducer from './reducer';
import saga from './saga';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

const TransactionManagement: React.SFC<Props> = (props: Props) => {
  return <Fragment>TransactionManagement</Fragment>
};

const mapStateToProps = createStructuredSelector({
  transactionManagement: makeSelectTransactionManagement(),
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch: dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'transactionManagement',
  reducer: reducer,
});
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
const withSaga = injectSaga<OwnProps>({
  key: 'transactionManagement',
  saga: saga,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TransactionManagement);
