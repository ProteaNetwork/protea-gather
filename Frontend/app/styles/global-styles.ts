import { injectGlobal } from './styled-components';

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  body {
    height: 100%;
    width: 100%;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  #app {
    background-color: #ffffff;
    min-height: 100%;
    min-width: 100%;
  }
`;
