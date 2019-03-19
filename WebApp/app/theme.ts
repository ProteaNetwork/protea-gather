import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const colors = {
  proteaBranding:{
    orange: '#f2a202',
    orangeDark: '#f57c00',
    orangeLight: '#ffa000',
    pink: '#FF4081',
    black: '#333333'
  },
  white: '#FFFFFF',
  black: '#FFFFFF',
}

const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      paper: '#fff',
      default: colors.proteaBranding.orange
    },
    primary: {
      main: colors.proteaBranding.black,
    },
    secondary: {
      main: colors.proteaBranding.orangeLight,
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: '\'Roboto\', sans-serif',
  },
  overrides:{
    MuiButton:{
      root:{
        backgroundColor: colors.proteaBranding.pink,
        textTransform: "uppercase",
        color: '#FFFFFF',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '4px 4px 8px 0px rgba(0,0,0,0.2)',
        '&:hover':{
          color: colors.proteaBranding.pink,
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
