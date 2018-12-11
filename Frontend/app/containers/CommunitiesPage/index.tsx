/**
 *
 * CommunitiesPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';
import image from 'images/kiwi.jpg';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
// import makeSelectCommunitiesPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import CommunityGrid from 'components/CommunityGrid';
import CommunitySearchSortBar from 'components/CommunitySearchSortBar';
import { updateFilter } from './actions';


// TODO: Remove this once hooked up to communities state tree
const communities = [
  {
    name: 'Eth Global',
    tokens: 128,
    logo: image,
    id: '1',
    onClick: (id) => console.log(id)
  }, {
    name: 'The fisherman',
    tokens: 6,
    logo: image,
    id: '2',
    onClick: (id) => console.log(id)
  }, {
    name: 'Fire truckers',
    tokens: 3,
    logo: image,
    id: '3',
    onClick: (id) => console.log(id)
  }, {
    name: 'Artists',
    tokens: 4,
    logo: image,
    id: '4',
    onClick: (id) => console.log(id)
  }, {
    name: 'Coders',
    tokens: 239,
    logo: image,
    id: '5',
    onClick: (id) => console.log(id)
  }, {
    name: 'Charities Global',
    tokens: 503,
    logo: image,
    id: '6',
    onClick: (id) => console.log(id)
  }, {
    name: 'Woodworkers',
    tokens: 3,
    logo: image,
    id: '7',
    onClick: (id) => console.log(id)
  }, {
    name: 'Event creators',
    tokens: 40,
    logo: image,
    id: '8',
    onClick: (id) => console.log(id)
  }
]

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
      // @ts-ignore
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
