/**
 *
 * ViewCommunityContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectViewCommunityContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import { RouteComponentProps } from 'react-router';


interface RouteParams {
  tbcAddress?: string; // must be type string since route params
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }


interface DispatchProps {}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

const ViewCommunityContainer: React.SFC<Props> = (props: Props) => {
  const { match: { params: { tbcAddress } } } = props;
  console.log(tbcAddress)
  return <Fragment>ViewCommunityContainer</Fragment>;
};

const mapStateToProps = createStructuredSelector({
  viewCommunityContainer: makeSelectViewCommunityContainer(),
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
  key: 'viewCommunity',
  reducer: reducer,
});
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
const withSaga = injectSaga<OwnProps>({
  key: 'viewCommunity',
  saga: saga,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ViewCommunityContainer);
