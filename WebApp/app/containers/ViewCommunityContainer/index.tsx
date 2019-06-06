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
import { forwardTo } from 'utils/history';
import { IMember } from 'domain/membershipManagement/types';
import { setFilter } from './actions';
import reducer from './reducer';
import injectReducer from 'utils/injectReducer';
import { BLTMExportPriceCalculation } from 'domain/communities/chainInteractions';
import { utils } from 'ethers';

interface RouteParams {
  tbcAddress: string; // must be type string since route params
}

interface OwnProps extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {
  community: ICommunity; // must be type string since route params
  events: IEvent[];
  balances: {ethBalance: number, daiBalance: number, ethAddress: string};
  filter: string;
  members: IMember[];
}

interface DispatchProps {
  getCommunity(tbcAddress: string):void;
  setFilter(filter: string): void;
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
    purchasePrice: 2
  };


  componentWillMount(){
    this.props.getCommunity(this.props.match.params.tbcAddress);
  }

  componentDidMount(){
    this.handleDaiValueChange(this.state.daiTxAmount);
  }

  handleChange = (event, slideIndex) => {
    this.setState({ slideIndex });
  };

  handleChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  handleDaiValueChange = (value) => {
    this.calcPurchasePrice(value);
    this.setState({daiTxAmount: value})
  }

  onCreateEvent = () => {
    forwardTo(`/events/${this.props.community.eventManagerAddress ? this.props.community.eventManagerAddress : '0x'}/create`)
  }


  calcPurchasePrice = (value: number) =>{
    if(this.props.community && this.props.community.contributionRate != undefined && this.props.community.totalSupply != undefined && this.props.community.poolBalance != undefined){
      const purchasePrice = BLTMExportPriceCalculation(
        utils.parseUnits(`${value}`,18),
        parseInt(`${this.props.community.contributionRate}`),
        utils.parseUnits(`${this.props.community.totalSupply}`,18),
        utils.parseUnits(`${this.props.community.poolBalance}`,18),
        parseFloat(`${this.props.community.gradientDenominator}`),
      )
      this.setState({purchasePrice: parseFloat(utils.formatUnits(purchasePrice, 18))})

    }else{
      setTimeout(() => {
        this.calcPurchasePrice(this.state.daiTxAmount);
      }, 2000);
    }
  }

  render() {
    const {
      community,
      events,
      balances,
      onIncreaseMembership,
      onWithdrawMembership,
      onJoinCommunity,
      filter,
      members,
      setFilter
    } = this.props;
    return (
    <Fragment>
      <ViewCommunity
        slideIndex={this.state.slideIndex}
        handleChange={this.handleChange}
        balances={balances}
        purchasePrice={this.state.purchasePrice}

        handleNameChange={setFilter}
        filter={filter}

        members={members}

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
    setFilter: (filter: string) =>{
      dispatch(setFilter(filter))
    },
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

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'viewCommunityPage',
  reducer: reducer,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withConnect
)(ViewCommunityContainer);
