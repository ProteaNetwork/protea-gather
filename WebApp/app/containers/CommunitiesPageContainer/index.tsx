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

interface OwnProps {}

interface DispatchProps {
  myCommunities: ICommunity[]; // must be type string since route params
  discoverCommunities: ICommunity[]; // must be type string since route params
  ethAddress: string;
}

type Props = DispatchProps & OwnProps;

class CommunitiesPageContainer extends React.Component<Props>  {
  state = {
    slideIndex: 0,
    filter: ""
  };

  handleNameChange = (name) =>{
    this.setState({filter: name})
  }

  handleSlideChange = (event, slideIndex) => {
    this.setState({ slideIndex });
  };

  handleSlideChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  componentDidMount(){
    // this.props.getCommunity(this.props.match.params.tbcAddress);
  }

  render(){
    const { discoverCommunities, myCommunities, ethAddress } = this.props;
    return (<Fragment>
      <CommunitiesView
        handleSlideChange={this.handleSlideChange}
        handleSlideChangeIndex={this.handleSlideChangeIndex}
        handleNameChange={this.handleNameChange}
        slideIndex={this.state.slideIndex}
        filter={this.state.filter}
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
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CommunitiesPageContainer);
