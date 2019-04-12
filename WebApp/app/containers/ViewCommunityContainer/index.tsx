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
  onJoinCommunity(daiValue: number, tbcAddress: string): void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onWithdrawMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

class ViewCommunityContainer extends React.Component<Props>  {
  state = {
    value: 0,
  };

  componentDidMount(){
    this.props.getCommunity(this.props.match.params.tbcAddress);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { community, events, balances , onIncreaseMembership, onWithdrawMembership, onJoinCommunity} = this.props;
    return (
    <Fragment>
        <ViewCommunity
          value={this.state.value}
          handleChange={this.handleChange}
          handleChangeIndex={this.handleChangeIndex}
          community={community}
          upcomingEvents={[]}
          pastEvents={[]}
        />
        <h2>
          Balances
        </h2>
        <div>
          Eth Balance: {`${balances.ethBalance}`},
          Dai Balance: {`${balances.daiBalance}`}
        </div>
        <h2>
          Community details
        </h2>
        <div>
          {
            community && Object.keys(community).map(key => {
              return (<span key={key}>
                {
                  `${key}: ${community[key]} ||  `
                }
              </span>)
            })
          }
        </div>
        <br/>
        {community && <Fragment>
          <Button disabled={community.transfersUnlocked} onClick={() => onJoinCommunity(2, community.tbcAddress, community.membershipManagerAddress)}>
            Join for 2 Dai
          </Button>
          <Button onClick={() => onIncreaseMembership(2, community.tbcAddress, community.membershipManagerAddress)}>
            Increase by 2 Dai
          </Button>
          <Button onClick={() => onWithdrawMembership(2, community.tbcAddress, community.membershipManagerAddress)}>
            Withdraw by 2 Dai
          </Button>
          <Button disabled={!community.isAdmin} onClick={() => this.props.history.push(`/events/${community.eventManagerAddress}/create`)}>
            Create Event
          </Button>
        </Fragment>
        }
        <h2>
          Event details
        </h2>
        <div>
          {
            events && events.map(event => {

              return(
                <div key={event.eventId}>
                  {
                    Object.keys(event).map(key => {
                      return `${key}: ${event[key]} ||  `
                    })
                  }
                  <br />
                  <Button onClick={() => this.props.history.push(`/events/${event.eventId}`)}>
                    Open {`${event.name}`}
                  </Button>
                </div>
              )
            })
          }
        </div>
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
