/**
 *
 * CommunitiesPageContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import selectCommunitiesPage from './selectors';
import { ICommunity } from 'domain/communities/types';
import CommunitiesView from 'components/CommunitiesView';
import { setFilter } from './actions';
import { refreshBalancesAction } from 'domain/transactionManagement/actions';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import { getAllCommunitiesAction } from 'domain/communities/actions';

interface OwnProps {
  filter: string;
  myCommunities: ICommunity[]; // must be type string since route params
  discoverCommunities: ICommunity[]; // must be type string since route params
  ethAddress: string;
}

interface DispatchProps {
  onLoadCommunities(): void;
  setFilter(filter: string): void;
}

type Props = DispatchProps & OwnProps;

class CommunitiesPageContainer extends React.Component<Props>  {
  state = {
    slideIndex: 0,
  };

  handleSlideChange = (event, slideIndex) => {
    this.setState({ slideIndex });
  };

  handleSlideChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  componentDidMount(){
    this.props.onLoadCommunities();
  }

  render(){
    const { setFilter, filter, discoverCommunities, myCommunities, ethAddress } = this.props;
    return (<Fragment>
      <CommunitiesView
        handleSlideChange={this.handleSlideChange}
        handleSlideChangeIndex={this.handleSlideChangeIndex}
        handleNameChange={setFilter}
        slideIndex={this.state.slideIndex}
        filter={filter}
        ethAddress={ethAddress}
        myCommunities={myCommunities}
        discoverCommunities={discoverCommunities}
      ></CommunitiesView>
    </Fragment>
    );
  }
};

const mapStateToProps = selectCommunitiesPage;

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setFilter: (filter: string) =>{
      dispatch(setFilter(filter))
    },
    onLoadCommunities: () => {
      dispatch(getAllCommunitiesAction())
    },
    refreshBalances: () =>  {
      dispatch(refreshBalancesAction())
    },
  };
}

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'communitiesPage',
  reducer: reducer,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withConnect
)(CommunitiesPageContainer);
