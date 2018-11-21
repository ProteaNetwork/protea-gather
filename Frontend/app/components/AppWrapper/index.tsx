import React, { Fragment } from 'react';
import classNames from 'classnames';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { NavLink, Link } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

const drawerWidth = 240;

const styles = theme => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
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
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    minHeight: '100vh',
    padding: theme.spacing.unit * 3,
  },
});

interface Props extends WithStyles<typeof styles> {
  isLoggedIn: boolean;
  onLogout: Function;
}

class AppWrapper extends React.Component<Props> {
  state = {
    drawerOpen: false,
    anchorEl: null,
  };

  toggleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.handleClose();
    const {onLogout} = this.props;
    onLogout();
  }

  render() {
    const { classes, children, isLoggedIn } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar disableGutters={isLoggedIn}>
            {isLoggedIn &&
              <IconButton
                aria-label="Open drawer"
                onClick={this.toggleDrawer}
                className={classes.menuButton} >
                <MenuIcon />
              </IconButton>
            }
            <Typography variant="h5" className={classes.appHeading} noWrap>
              Protea
            </Typography>
            {!isLoggedIn ? (
              <Fragment>
                <Link to='/login' style={{ textDecoration: 'none' }}>
                  <Button color="inherit">
                    Login
                  </Button>
                </Link>
                <Link to='/Signup' style={{ textDecoration: 'none' }}>
                  <Button color="inherit">
                    Sign Up
                  </Button>
                </Link>
              </Fragment>
            ) : (
                <div>
                  <IconButton
                    className={classes.profileButton}
                    aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit">
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}>
                    <Link to='/profile' style={{ textDecoration: 'none' }}>
                      <MenuItem onClick={this.handleClose}>
                        Profile
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={this.handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )
            }
          </Toolbar>
        </AppBar>
        {isLoggedIn &&
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.drawerOpen && classes.drawerPaperClose),
            }}
            open={this.state.drawerOpen}>
            <div className={classes.toolbar}>
              <IconButton onClick={this.toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <ListItem button>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Landing'} />
                </ListItem>
              </NavLink>
              <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
                <ListItem button>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Dashboard'} />
                </ListItem>
              </NavLink>
            </List>
          </Drawer>
        }
        <main className={classes.content}>
          {children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
