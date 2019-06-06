/**
 *
 * TokenManagement
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Button, Fab } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    root:{
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      padding: "0 20px",
      margin: "20px 0",
      "& > *":{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        margin:"5px 0",
        "&:last-child > *":{
          display: "block",
          flexGrow: 1,
          flexBasis: 1,
          textAlign: "center",
          color: colors.white
        }
      },

    },
    buttons:{
      flexGrow: 1,
      flexBasis: "30%",
      backgroundColor: colors.proteaBranding.pink,
      // margin: 5,
    },
    price: {
      minWidth: "100px",
      "& span":{
        display: "block",
        backgroundColor: colors.white,
        color: colors.black,
        padding: "5px 10px",
        margin: "0 10px",
        borderRadius: 5,
        textAlign: "center",
        fontWeight: 500
      }
    },
    fab:{
      color: colors.white,
      backgroundColor: colors.proteaBranding.pink,
      "&:hover":{
        color: colors.white,
        backgroundColor: colors.proteaBranding.pink,
      },
      "& > *":{
        color: colors.white,
      },
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  daiTxAmount: number;
  purchasePrice: number;
  handleDaiValueChange(event: any): void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onWithdrawMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  availableStake: number;
  isMember: boolean;
  daiBalance: number;
  tbcAddress: string;
  membershipManagerAddress: string;
}

const TokenManagement: React.SFC<OwnProps> = (props: OwnProps) => {
  const {classes, handleDaiValueChange, daiTxAmount, availableStake, isMember, daiBalance, tbcAddress, membershipManagerAddress, onWithdrawMembership, onJoinCommunity, onIncreaseMembership, purchasePrice } = props;
  return <section className={classes.root}>
  <div>
    <div>
      <Fab className={classes.fab} onClick={() => handleDaiValueChange(daiTxAmount + 1)}>
        <Add />
      </Fab>
    </div>
  </div>
  <div>
    <Button
      className={classes.buttons}
      disabled={availableStake < parseFloat(`${daiTxAmount}`) || `${daiTxAmount}` == ""}
      onClick={() => onWithdrawMembership(daiTxAmount, tbcAddress, membershipManagerAddress)}
      size="large">
      {`Sell`}
    </Button>
    <div className={classes.price}>
      {/* <Input type="number" inputProps={{ min: "1", max: `${balances.daiBalance}`, step: "1" }} onChange={(event) => handleDaiValueChange(event.target.value)} value={daiTxAmount} /> */}
      <span>
        {daiTxAmount} DAI
      </span>
    </div>
    {!isMember && <Button
      className={classes.buttons}
      onClick={() => onJoinCommunity(daiTxAmount, tbcAddress, membershipManagerAddress)}
      disabled={daiBalance < parseFloat(`${purchasePrice}`) || `${purchasePrice}` == ""}
      size="large">
      {`Buy`}
    </Button>}
    {isMember && <Button
      className={classes.buttons}
      disabled={parseFloat(`${daiBalance}`) < parseFloat(`${purchasePrice}`) || `${purchasePrice}` == ""}
      onClick={() => onIncreaseMembership(daiTxAmount, tbcAddress, membershipManagerAddress)}
      size="large">
      {`Buy`}
    </Button>}
  </div>
  <div>
    <div>

    </div>
    <div>
      <Fab className={classes.fab} onClick={() => handleDaiValueChange((daiTxAmount - 1) != 0 ? daiTxAmount - 1 : 1)}>
        <Remove />
      </Fab>
    </div>
    <div>
      <span>
      (incl. Contributions): <br/> {purchasePrice.toFixed(2)} DAI
      </span>
    </div>

  </div>
</section>;
};

export default withStyles(styles, { withTheme: true })(TokenManagement);
