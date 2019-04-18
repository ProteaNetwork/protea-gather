/**
 *
 * ViewCommunityContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import selectViewCommunityContainer from './selectors';
import { ICommunity } from 'domain/communities/types';
import { IEvent } from 'domain/events/types';
import { getCommunityAction, joinCommunityAction } from 'domain/communities/actions';
import { RouteComponentProps } from 'react-router-dom';
import { withdrawMembershipAction, increaseMembershipAction } from 'domain/membershipManagement/actions';
import ViewCommunity from 'components/ViewCommunity';
import { Button } from '@material-ui/core';
import { forwardTo } from 'utils/history';

interface RouteParams {
  tbcAddress: string; // must be type string since route params
}

interface OwnProps extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {
  community: ICommunity; // must be type string since route params
  events: IEvent[];
  balances: any;
}

interface DispatchProps {
  getCommunity(tbcAddress: string):void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onWithdrawMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

class ViewCommunityContainer extends React.Component<Props>  {
  state = {
    slideIndex: 0,
    daiTxAmount: 2,
  };

  componentDidMount(){
    this.props.getCommunity(this.props.match.params.tbcAddress);
  }

  handleChange = (event, slideIndex) => {
    this.setState({ slideIndex });
  };

  handleChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  handleDaiValueChange = (event) => {
    this.setState({daiTxAmount: event.target.value})
  }

  onCreateEvent = () => {
    forwardTo(`/events/${this.props.community.eventManagerAddress ? this.props.community.eventManagerAddress : '0x'}/create`)
  }

  render() {
    const { community, events, balances, onIncreaseMembership, onWithdrawMembership, onJoinCommunity} = this.props;
    return (
    <Fragment>
      <ViewCommunity
        slideIndex={this.state.slideIndex}
        handleChange={this.handleChange}
        balances={balances}
        onCreateEvent={this.onCreateEvent}
        handleChangeIndex={this.handleChangeIndex}
        handleDaiValueChange={this.handleDaiValueChange}
        onIncreaseMembership={onIncreaseMembership}
        onWithdrawMembership={onWithdrawMembership}
        onJoinCommunity={onJoinCommunity}
        community={community}
        daiTxAmount={this.state.daiTxAmount}
        upcomingEvents={events.filter((event: IEvent) => event.state == 1)}
        activeEvents={events.filter((event: IEvent) => event.state == 2)}
        pastEvents={events.filter((event: IEvent) => event.state == 3)}
      />
    </Fragment>
    );
  }
};

const mapStateToProps = selectViewCommunityContainer;

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    getCommunity: (tbcAddress: string) => {
      dispatch(getCommunityAction.request(tbcAddress))
    },
    onJoinCommunity: (daiValue: number, tbcAddress: string, membershipManagerAddress: string) => {
      dispatch(joinCommunityAction.request({
        daiValue: daiValue,
        tbcAddress: tbcAddress,
        membershipManagerAddress: membershipManagerAddress
      }))
    },
    onIncreaseMembership: (daiValue: number, tbcAddress: string, membershipManagerAddress: string) =>{
      dispatch(increaseMembershipAction.request({
        daiValue: daiValue,
        tbcAddress: tbcAddress,
        membershipManagerAddress: membershipManagerAddress
      }))
    },
    onWithdrawMembership: (daiValue: number, tbcAddress: string, membershipManagerAddress: string) =>{
      dispatch(withdrawMembershipAction.request({
        daiValue: daiValue,
        tbcAddress: tbcAddress,
        membershipManagerAddress: membershipManagerAddress
      }))
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ViewCommunityContainer);
