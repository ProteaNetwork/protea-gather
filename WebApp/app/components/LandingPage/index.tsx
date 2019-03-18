import { Button, Typography, WithStyles } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose, Dispatch } from 'redux';
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
    maxWidth: '150px',
    "& path":{
      stroke: "#FFFFFF",
      strokeWidth: '10px'
    }
  },
  proteaTitle: {
    maxWidth: '300px',
    margin: "30px 0"
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
        <ReactSVG className={classes.logo} src="protea_logo_outline.svg" />
        <ReactSVG className={classes.proteaTitle} src="protea_white_text.svg" />
        <Button className={classes.button} onClick={onConnectClick} disabled={!isWalletUnlocked}>Connect</Button>
        <Button className={classes.button}>Discover</Button>
        <Typography variant="subtitle1">{errorMessage}</Typography>
      </main>
    </Fragment>
  );
};

const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  composeWithStyles,
)(LandingPage);
