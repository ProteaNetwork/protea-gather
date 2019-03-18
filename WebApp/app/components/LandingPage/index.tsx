import { Button, Typography, WithStyles } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose, Dispatch } from 'redux';


const styles = () => createStyles({
  layout: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #f39c12 0%, rgba(243, 156, 18, 0) 70%), ' +
      'linear-gradient(25deg, #f1c40f 10%, rgba(241, 196, 15, 0) 80%), ' +
      'linear-gradient(315deg, #ff9933 15%, rgba(255, 153, 51, 0) 80%), ' +
      'linear-gradient(245deg, #d35400 100%, rgba(211, 84, 0, 0) 70%);',
  },
  appName: {
    color: 'white',
  },
  connectButton: {
    backgroundColor: 'white',
    color: 'black',
  },
  link: {
    textDecoration: 'none',
  },
});

interface Props extends WithStyles<typeof styles> {
  onConnectClick(): void;
  isWalletUnlocked: boolean;
  errorMessage: string;
}

const LandingPage: React.SFC<Props> = ({ onConnectClick, isWalletUnlocked, errorMessage, classes }: Props) => {
  return (
    <Fragment>
      <main className={classes.layout}>
        <img src="protea_logo_large.png" alt="" />
        <Typography variant="h3" className={classes.appName}>Protea</Typography>
        <Button variant="outlined" className={classes.connectButton} onClick={onConnectClick} disabled={!isWalletUnlocked}>Connect</Button>
        <Typography variant="subtitle1">{errorMessage}</Typography>
      </main>
    </Fragment>
  );
};

const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  composeWithStyles,
)(LandingPage);
