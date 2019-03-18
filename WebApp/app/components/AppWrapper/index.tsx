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
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { Dashboard } from '@material-ui/icons';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import { appRoute } from 'containers/App/routes';
import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

const styles = theme => createStyles({
  root: {
    display: 'flex',
    maxHeight: '100%',
    height: '100vh',
    maxWidth: '100%',
    background:
    'linear-gradient(135deg, hsla(36.8, 90.36%, 51.18%, 1) 0%, hsla(36.8, 90.36%, 51.18%, 0) 70%),' +
    'linear-gradient(25deg, hsla(48.05, 88.98%, 50.2%, 1) 10%, hsla(48.05, 88.98%, 50.2%, 0) 80%),' +
    'linear-gradient(315deg, hsla(30, 100%, 60%, 1) 15%, hsla(30, 100%, 60%, 0) 80%),' +
    'linear-gradient(245deg, hsla(23.89, 100%, 41.37%, 1) 100%, hsla(23.89, 100%, 41.37%, 0) 70%)'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginLeft: 12,
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
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  contentLoggedIn: {
    padding: theme.spacing.unit * 3,
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
    paddingLeft: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
  },
});

interface Props extends WithStyles<typeof styles> {
  isLoggedIn: boolean;
  onLogout(): void;
  name: string;
  ensName: string;
  tokenBalance: number;
  image: string;
  navLinks: appRoute[];
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
    const { classes, children, isLoggedIn, name, ensName, tokenBalance, image, onLogout, navLinks } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {isLoggedIn && (
          <ClickAwayListener onClickAway={this.close}>
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
                <img src="protea_logo_60.png" className={classes.logo} />
              </Toolbar>
            </AppBar>
          </ClickAwayListener>
        )}
        <ClickAwayListener onClickAway={this.close}>
          <Drawer
            variant="persistent"
            open={this.state.open} >
            <div className={classes.spacer} />
            <div className={classes.userInformation}>
              <Avatar alt={name} src={image} className={classes.bigAvatar}>{name.substring(0, 1)}</Avatar>
              <Typography variant="h3">{name}</Typography>
              <Typography variant="body1">{ensName}</Typography>
              <Typography variant="body1">{tokenBalance} DAI</Typography>
              <Button onClick={onLogout}>Logout</Button>
            </div>
            <Divider />
            <List>
              {
                navLinks.map(({ name, path, routeNavLinkIcon }) => (
                  <NavLink to={path} className={classes.link} key={name}>
                    <ListItem button>
                      <ListItemIcon>
                        {(routeNavLinkIcon) ? React.createElement(routeNavLinkIcon) : <Fragment />}
                      </ListItemIcon>
                      <ListItemText primary={name} />
                    </ListItem>
                  </NavLink>
                ))
              }
            </List>
          </Drawer>
        </ClickAwayListener>
        <main className={classNames(classes.content, isLoggedIn && classes.contentLoggedIn)}>
          {isLoggedIn && <div className={classes.toolbar} />}
          {children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
