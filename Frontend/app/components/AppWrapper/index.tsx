import React from 'react';
import classNames from 'classnames';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
// import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from 'react-router-dom';
import { Typography, Avatar, Divider } from '@material-ui/core';

const styles = theme => createStyles({
  root: {
    display: 'flex',
    maxHeight: '100%',
    height: '100vh',
    maxWidth: '100%'
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
    transform: 'translate(-50%,-50%)'
  },
  spacer: {
    height: '80px'
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
  onLogout: Function;
  name: string;
  ensName: string;
  tokenBalance: number;
  image: string;
}

class AppWrapper extends React.Component<Props> {
  state = {
    open: false
  };

  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
    console.log("handleDrawerToggle");
  };

  close = () => {
    this.setState({ open: false });
    console.log("close");
  };

  render() {
    const { classes, children, isLoggedIn, name, ensName, tokenBalance, image } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <ClickAwayListener onClickAway={this.close}>
          {isLoggedIn &&
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
              <img src='protea_logo_60.png' className={classes.logo} />
            </Toolbar>
          </AppBar> }
          <Drawer
            variant="persistent"
            open={this.state.open}
          >
            <div className={classes.spacer} />
            <div className={classes.userInformation}>
              <Avatar alt={name} src={image} className={classes.bigAvatar}>{name.substring(0, 1)}</Avatar>
              <Typography variant='h3'>{name}</Typography>
              <Typography variant='body1'>{ensName}</Typography>
              <Typography variant='body1'>{tokenBalance} DAI</Typography>
            </div>
            <Divider />
            <List>
              <NavLink to="/dashboard" className={classes.link} >
                <ListItem button>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Dashboard'} />
                </ListItem>
              </NavLink>
              <NavLink to="/communities" className={classes.link} >
                <ListItem button>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Communities'} />
                </ListItem>
              </NavLink>
              <NavLink to="/events" className={classes.link} >
                <ListItem button>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Events'} />
                </ListItem>
              </NavLink>
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
