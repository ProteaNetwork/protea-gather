/**
 *
 * DiscoverCommunitiesContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

interface OwnProps {}

interface DispatchProps {}

type Props = DispatchProps & OwnProps;

const DiscoverCommunitiesContainer: React.SFC<Props> = (props: Props) => {
  return <Fragment>DiscoverCommunitiesContainer</Fragment>;
};

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch: dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(DiscoverCommunitiesContainer);
