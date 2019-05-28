import { Button, Typography, WithStyles } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import { compose } from 'redux';
import ReactSVG from 'react-svg';


const styles = () => createStyles({
  layout: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appName: {
    color: 'white',
  },
  link: {
    textDecoration: 'none',
  },
  button:{
    margin: '10px 0'
  },
  logo:{
    height:"auto",
    "& svg":{
      width: "400px",
      height: "auto",
      maxWidth: "75vw"
    },
    "& path":{
      stroke: "#FFFFFF",
    }
  },
  error:{
    textAlign: "center",
    padding: "0 40px"
  }
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
        <ReactSVG className={classes.logo} src="ProteaGatherLogo.svg" />
        <Button className={classes.button} onClick={onConnectClick} disabled={!isWalletUnlocked}>Connect</Button>
        <Button className={classes.button}>Discover</Button>
        <Typography className={classes.error} variant="subtitle1">{errorMessage}</Typography>
      </main>
    </Fragment>
  );
};

const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  composeWithStyles,
)(LandingPage);
