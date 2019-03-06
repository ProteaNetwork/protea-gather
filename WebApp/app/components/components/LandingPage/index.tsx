import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Button, WithStyles } from '@material-ui/core';
import {Link} from 'react-router-dom';
import { Dispatch, compose } from 'redux';
import { connect } from 'react-redux';

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
  }
});

// tslint:disable-next-line:no-empty-interface
interface OwnProps extends WithStyles<typeof styles>  {

}

// tslint:disable-next-line:no-empty-interface
interface DispatchProps {
  toggleLogin(): void;
}

// tslint:disable-next-line:no-empty-interface
interface StateProps {

}

type Props = StateProps & DispatchProps & OwnProps;

const LandingPage: React.SFC<Props> = ({toggleLogin, classes}: Props) => {
  return (
  <Fragment>
    <main className={classes.layout}>
        <img src='Protea_Logo_White.png' alt='' />
        <Typography variant='h3' className={classes.appName}>Protea</Typography>
        <Link to='/dashboard' className={classes.link}>
          <Button variant='outlined' className={classes.connectButton} onClick={toggleLogin}>Connect</Button>
        </Link>
    </main>
  </Fragment>
  )
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch: dispatch,
    toggleLogin: () => { console.log('stuffs'); },
  };
}

const withConnect = connect(null, mapDispatchToProps);
const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  withConnect,
  composeWithStyles
)(LandingPage);
