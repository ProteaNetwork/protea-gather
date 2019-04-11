/**
 *
 * ProfileContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import makeSelectProfileContainer from './selectors';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

const ProfileContainer: React.SFC<Props> = (props: Props) => {
  return <Fragment>ProfileContainer</Fragment>;
};

const mapStateToProps = createStructuredSelector({
  profileContainer: makeSelectProfileContainer(),
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

export default compose(
  withConnect,
)(ProfileContainer);
