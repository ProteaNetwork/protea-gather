import { Avatar, Button, Divider, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
// import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import { appRoute } from 'containers/App/routes';
import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import ReactSVG from 'react-svg';
import { colors } from 'theme';
import NetworkState from 'components/NetworkState';
import QrScannerContainer from 'containers/QrScannerContainer';

const styles = ({ palette, breakpoints, spacing, zIndex, mixins}: Theme) => createStyles({
  root: {
    display: 'flex',
    maxHeight: '100%',
    height: '100%',
    maxWidth: '100%',
    background:
    'linear-gradient(135deg, hsla(36.8, 90.36%, 51.18%, 1) 0%, hsla(36.8, 90.36%, 51.18%, 0) 70%),' +
    'linear-gradient(25deg, hsla(48.05, 88.98%, 50.2%, 1) 10%, hsla(48.05, 88.98%, 50.2%, 0) 80%),' +
    'linear-gradient(315deg, hsla(30, 100%, 60%, 1) 15%, hsla(30, 100%, 60%, 0) 80%),' +
    'linear-gradient(245deg, hsla(23.89, 100%, 41.37%, 1) 100%, hsla(23.89, 100%, 41.37%, 0) 70%)'
  },
  appBarLogo:{
    '& svg':{
      width: "65px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  },
  appBar: {
    zIndex: zIndex.drawer + 1,
  },
  menuButton: {
    marginLeft: 12,
    '& svg': {
      fill: '#FFFFFF'
    }
  },
  profileButton: {
    marginLeft: 36,
    marginRight: 12,
  },
  hide: {
    display: 'none',
  },
  appHeading: {
    flexGrow: 1,
    textAlign: 'center',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    minHeight: '100vh',
    boxSizing: 'border-box',
    maxWidth: "100%",
  },
  contentLoggedIn: {
    // padding: `${56 + theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`
    [breakpoints.up("xs")]: {
      paddingTop: "55px"
    },
    [breakpoints.up("sm")]: {
      paddingTop: "60px"
    },

  },
  link: {
    textDecoration: 'none',
  },
  logo: {
    height: '60px',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  spacer: {
    height: '80px',
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
  userInformation: {
    paddingLeft: spacing.unit * 3,
    paddingBottom: spacing.unit * 3,
  },
  paperRoot:{
    backgroundColor: colors.proteaBranding.blackBg,
    paddingTop: 65,
    color: colors.white,
  },
  navItem:{
    color: colors.white,

  }
});

interface Props extends WithStyles<typeof styles> {
  onLogout(): void;
  isLoggedIn: boolean;
  displayName: string;
  daiBalance: number;
  profileImage: string;
  ethAddress: string;
  navLinks: appRoute[];
  networkId: number;
  networkReady: boolean;
}

class AppWrapper extends React.Component<Props> {
  public state = {
    open: false,
  };

  public handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };

  public close = () => {
    this.setState({ open: false });
  };

  public render() {
    const { networkId, networkReady, classes, isLoggedIn, children, displayName, daiBalance, profileImage, onLogout, navLinks, ethAddress } = this.props;
    return (
      <div className={classes.root}>
      {isLoggedIn && (
          <Fragment>
            <AppBar
            position="fixed"
            className={classes.appBar} >
            <Toolbar
              disableGutters={true}
            >
              {
                this.state.open ?
                  <IconButton
                    color="inherit"
                    aria-label="Close drawer"
                    onClick={this.handleDrawerToggle}
                    className={classes.menuButton} >
                    <ChevronLeftIcon />
                  </IconButton>
                  :
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerToggle}
                    className={classes.menuButton} >
                    <MenuIcon />
                  </IconButton>
              }
              <Link className={classes.appBarLogo} to="/dashboard">
                <ReactSVG src="/protea_logo_outline.svg" />
              </Link>
            </Toolbar>
          </AppBar>
          <ClickAwayListener onClickAway={this.close}>
            <Drawer
              variant="persistent"
              classes= {{paper: classes.paperRoot}}
              anchor="left"
              open={this.state.open} >
              <List>
                {
                  navLinks.map(({ name, path, routeNavLinkIcon }) => (
                    <NavLink onClick={this.close} to={path} className={classes.link} key={name}>
                      <ListItem button>
                        {/* <ListItemIcon>
                          {(routeNavLinkIcon) ? React.createElement(routeNavLinkIcon) : <Fragment />}
                        </ListItemIcon> */}
                        <ListItemText className={classes.navItem} primaryTypographyProps={{color:"inherit" }} color="inherit" primary={name} />
                      </ListItem>
                    </NavLink>
                  ))
                }
                <ListItem className={classes.link} button onClick={() => {this.close(); onLogout()}}>
                  <ListItemText className={classes.navItem} primaryTypographyProps={{color:"inherit" }} color="inherit" primary={'Logout'} />
                </ListItem>
              </List>
            </Drawer>
          </ClickAwayListener>
          </Fragment>
        )}

        <main className={classNames(classes.content, isLoggedIn && classes.contentLoggedIn)}>
          {children}
        </main>
        <QrScannerContainer></QrScannerContainer>
        <NetworkState networkId={networkId} ready={networkReady}></NetworkState>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
