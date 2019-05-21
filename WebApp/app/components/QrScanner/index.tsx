/**
 *
 * QrScanner
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import QrReader from 'react-qr-reader'

const styles = (theme: Theme) =>
  createStyles({
    scanner:{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      height: "100vw",
      width:"100vw",
      zIndex: 99999999
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  onScan(data:any):void;
  onError(data: any): void;
}

const QrScanner: React.SFC<OwnProps> = (props: OwnProps) => {
  const { classes, onError, onScan } = props;
  const settings = {
    resolution: 600,
    delay: 300,
    facingMode: "environment"
  }
  return <Fragment>
    <QrReader
      {...settings}
      className={classes.scanner}
      onError={onError}
      onScan={onScan}
    />
  </Fragment>;
};

export default withStyles(styles, { withTheme: true })(QrScanner);
