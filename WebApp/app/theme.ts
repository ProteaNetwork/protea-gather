import createMuiTheme from '@material-ui/core/styles/createMuiTheme';


const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      paper: '#fff',
      default: '#f2a202'
    },
    primary: {
      main: '#f57c00',
    },
    secondary: {
      main: '#ffa000',
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: '\'Roboto\', sans-serif',
  },
  overrides:{
    MuiButton:{
      root:{
        backgroundColor: '#FF4081',
        textTransform: "uppercase",
        color: '#FFFFFF',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '4px 4px 8px 0px rgba(0,0,0,0.2)',
        '&:hover':{
          color: '#FF4081',
          backgroundColor: '#FFFFFF'
        }
      },
      text: {
        padding: '7px 15px'
      }
    }
  }
});

export default theme;
