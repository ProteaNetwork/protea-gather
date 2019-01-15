/**
 *
 * CommunitiesPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
// import makeSelectCommunitiesPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import CommunityGrid from 'components/CommunityGrid';
import CommunitySearchSortBar from 'components/CommunitySearchSortBar';
import { updateFilter } from './actions';

import footyCommunityImage from 'images/footyConnunity.jpg';
import xWingCommunity from 'images/xWingCom.jpg';
import marketsCommunity from 'images/Curation Markets.jpg';
import ethCTCommunity from 'images/ETHCTCom.jpg';


// TODO: Remove this once hooked up to communities state tree
const communities = [{
  name: 'ETH Cape Town',
  tokens: 128,
  logo: ethCTCommunity,
  id: '1',
  onClick: (id) => console.log(id)
}, {
  name: 'X-Wing Cape Town',
  tokens: 6,
  logo: xWingCommunity,
  id: '2',
  onClick: (id) => console.log(id)
}, {
  name: 'Fiver Footy Cape Town',
  tokens: 3,
  logo: footyCommunityImage,
  id: '3',
  onClick: (id) => console.log(id)
}, {
  name: 'Curation Markets Global',
  tokens: 4,
  logo: marketsCommunity,
  id: '4',
  onClick: (id) => console.log(id)
}];

interface StateProps {
  searchParameter: string;
  sortParameter: number;
}

interface DispatchProps {
  updateFilter(data);
}

interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps;

function CommunitiesPage(props: Props) {
  const { searchParameter, sortParameter, updateFilter } = props;

  return (
    <div>
      <CommunitySearchSortBar searchParameter={searchParameter} sortParameter={sortParameter} onChange={updateFilter} />
      {/*
      // @ts-ignore */}
      <CommunityGrid communities={communities} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  searchParameter: state.communitiespage.searchParameter,
  sortParameter: state.communitiespage.sortParameter,
});

export function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateFilter: (evt: { target: HTMLInputElement }) => dispatch(updateFilter({name: evt.target.name, value: evt.target.value})),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'communitiespage', reducer });
const withSaga = injectSaga({ key: 'communitiespage', saga });

export default compose<TReducer, TSaga, TConnect, ReturnType>(
  withReducer,
  withSaga,
  withConnect,
)(CommunitiesPage);

type ReturnType = React.ComponentType /*<OwnProps>*/;
type TReducer = ReturnType;
type TSaga = ReturnType;
type TConnect = typeof CommunitiesPage;
