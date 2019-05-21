/**
 *
 * QrScannerContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import QrScanner from 'components/QrScanner';
import { makeSelectQrState } from './selectors';
import { scanQrCodeAction } from './actions';

interface OwnProps {}

interface DispatchProps {
  onScan(data: string): void;
  onError(data: string): void;
}

interface StateProps {
  active: boolean
}

type Props = StateProps & DispatchProps & OwnProps;

const QrScannerContainer: React.SFC<Props> = (props: Props) => {
  const { active, onScan, onError } = props;

  const onScanParse = (data) => {
    if(data && data.indexOf("0x") >= 0){
      onScan(data);
    }
  }
  return <Fragment>
    {active && <QrScanner onScan={onScanParse} onError={onError}></QrScanner>}
  </Fragment>
};

const mapStateToProps = createStructuredSelector({
  active: makeSelectQrState,
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onScan: (data: string) => {
      dispatch(scanQrCodeAction.success(data))
    },
    onError: (data: string) => {
      dispatch(scanQrCodeAction.failure(data))
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'qrScannerContainer',
  reducer: reducer,
});

export default compose(
  withReducer,
  withConnect,
)(QrScannerContainer);
