/**
 *
 * TxLoadingModal
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CircularProgress, Typography, Fab } from '@material-ui/core';
import classNames from 'classnames';
import { colors } from 'theme';
import { Close, CloudDownload } from '@material-ui/icons';
import QrModal from 'components/QrModal';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    modalRoot:{
      display: "block",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      visibility: "hidden",
      opacity: 0,
      zIndex: 99999,
      transitionDuration: "400ms",
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: colors.proteaBranding.orange,
        zIndex: -1,
        opacity: 0.5
      },
      "&.active":{
        opacity: 1,
        visibility: "visible"
      }
    },
    infoRoot:{
      position: "absolute",
      top: "50%",
      left: "50%",
      padding:"25vh 25vw",
      transform: "translate(-50%,-50%)",
      display: "flex",
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: "center",
      height: "100%",
      width: "100%",
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: "50%",
        left: "50%",
        height: "100vh",
        width: "100vw",
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(ellipse at center, ${colors.proteaBranding.orange} 0%,rgba(242,162,2,0) 80%)`,
        zIndex: -1,
        opacity: 0.8
      }
    },
    spinner:{
      color: colors.proteaBranding.pink,
      zIndex: 99999999
    },
    txRemaining: {
      color: colors.white,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginTop: 20
    },
    txContext: {
      color: colors.white,
      fontWeight: 'bold',
      marginTop: 20
    },

  });

interface OwnProps extends WithStyles<typeof styles> {
  pendingTx: boolean;
  txRemaining: number;
  txContext: string;
  qrData: string;
  onCloseQr(): void;
}

const TxLoadingModal: React.SFC<OwnProps> = (props: OwnProps) => {
  const { onCloseQr, classes, pendingTx, txRemaining, txContext, qrData } = props;
  return (
  <div className={classNames(classes.modalRoot, pendingTx ? "active" : "", qrData != "" ? 'active': '')}>
    {
      <div className={classes.infoRoot}>
        {
          pendingTx && <Fragment>
            <div className={classes.spinner}>
              <CircularProgress color={"inherit"} size={80}></CircularProgress>
            </div>
            <Typography className={classes.txRemaining} component='h4' variant='h4'>
              Transactions remaining: {`${txRemaining}`}
            </Typography>
            <Typography className={classes.txContext} component='h4' variant='h4'>
              {`${txContext}`}
            </Typography>
          </Fragment>
        }
      </div>
    }
    {
      qrData != "" && <QrModal qrData={qrData} onCloseQr={onCloseQr}></QrModal>

    }
</div>);
};

export default withStyles(styles, { withTheme: true })(TxLoadingModal);
