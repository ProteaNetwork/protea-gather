/**
 *
 * NetworkState
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      position: 'fixed',
      bottom:0,
      right:0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: colors.proteaBranding.blackBg,
      borderTopLeftRadius: 10,
      color: colors.white,
      padding: "3px 10px",
      "& > *:last-child":{
        height: 10,
        width: 10,
        marginLeft: 5,
        display: 'block',
        borderRadius: 30,
        backgroundColor: 'red',
        "&.ready":{
          backgroundColor: 'green'
        }
      }
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  ready: boolean;
  networkId: number;
}

const NetworkState: React.SFC<OwnProps> = (props: OwnProps) => {
  const {classes, ready, networkId} = props;
  let networkName: string = "";
  if(networkId == 1){
    networkName = "Mainnet"
  }else if(networkId == 5){
    networkName = 'Goerli'
  }else if(networkId == 4){
    networkName = 'Rinkeby'
  }else if(networkId == 42){
    networkName = 'Kovan'
  }else if(networkId == 3){
    networkName = 'Ropsten'
  }else{
    networkName = 'Not connected'
  }
  return <div className={classes.root}>

    <span>
      {networkName}
    </span>
    <div className={ready ? 'ready'  : ''}>

    </div>
  </div>;
};

export default withStyles(styles, { withTheme: true })(NetworkState);
