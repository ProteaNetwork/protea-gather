import React from 'react';
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
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from 'react-router-dom';
import ScrollArea from 'xico2k-react-scroll-area';

const drawerWidth = 240;

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
    width: 0
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
    overflow: 'hidden',
  },
  footer: {
    zIndex: theme.zIndex.drawer + 1,
    top: 'auto',
    bottom: 0,
  }
});

interface Props extends WithStyles<typeof styles> {
  isLoggedIn: boolean;
  onLogout: Function;
}

class AppWrapper extends React.Component<Props> {
  state = {
    open: false
  };

  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classes.appBar} >
          <Toolbar>
            <Typography variant='h6'>Logo</Typography>
            <Typography
              variant="h6"
              className={classes.appHeading}
              noWrap >
              Protea Webapp
            </Typography>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton} >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <ScrollArea height='85%'
            minHandlerHeight={200}
            trackVisible>
            {children}
          </ScrollArea>
        </main>
        <AppBar position="fixed" color="primary" className={classes.footer}>
          <Toolbar className={classes.toolbar}>
            <Typography
              variant="h6"
              className={classes.appHeading}
              noWrap >
              Footer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}>
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
              </ListItem>
            </NavLink>
            <NavLink to="/communities" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={'Communities'} />
              </ListItem>
            </NavLink>
            <NavLink to="/events" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={'Events'} />
              </ListItem>
            </NavLink>
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
