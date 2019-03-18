/**
 *
 * LandingPageContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import { RootState } from './types';

import LandingPage from 'components/LandingPage';
import { ethers } from 'ethers';
import { ApplicationRootState } from 'types';
import { authenticate } from '../../domain/authentication/actions';

interface OwnProps { }

interface StateProps {
  isWalletUnlocked: boolean;
  errorMessage: string;
}

interface DispatchProps {
  onConnectClick(): void;
}

type Props = StateProps & DispatchProps & OwnProps;

export const LandingPageContainer: React.SFC<Props> = ({ onConnectClick, isWalletUnlocked, errorMessage }: Props) => {
  return <LandingPage onConnectClick={onConnectClick} isWalletUnlocked={isWalletUnlocked} errorMessage={errorMessage} />;
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    onConnectClick: () => dispatch(authenticate.request()),
  };
};

const mapStateToProps = (state: ApplicationRootState) => ({
  isWalletUnlocked: state.authentication.walletUnlocked,
  errorMessage: state.authentication.errorMessage,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LandingPageContainer);
