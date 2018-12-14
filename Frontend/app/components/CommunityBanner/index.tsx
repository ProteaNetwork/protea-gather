/**
 *
 * CommunityBanner
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Paper, Typography, Theme, Card, CardHeader, CardMedia, Button } from '@material-ui/core';

const styles = ({ spacing }: Theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    marginTop: spacing.unit * 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 2}px ${spacing.unit * 2}px`,
  },
  media: {
    height: 400,
    width: 400,
    alignContent: 'center',
  },
  buttonTop: {
    margin: spacing.unit,
    alignSelf: 'right',
    float: "left",
  },
  button: {
    margin: spacing.unit,
    alignSelf: 'right',
    float: "right",
  },
});

interface OwnProps {
  classes: any;
  logo: string;
  name: string;
  tokenSymbol: string;
  tokenValueSymbol: string;
  value: number;
}

const CommunityBanner: React.SFC<OwnProps> = (props: OwnProps) => {
  const { classes,  name, logo, tokenSymbol, value, tokenValueSymbol } = props;

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Card className={classes.card}>
          <Button variant="raised" color="primary" className={classes.buttonTop}>
            Back
          </Button>
          <CardMedia
            className={classes.media}
            image={logo}
            title={name} />
          <CardHeader
            title={name}
            subheader={
              <Typography>
                1 {tokenSymbol} ~ {value} {tokenValueSymbol}
                <Button variant="contained" color="primary" className={classes.button}>
                  Buy
                </Button>
                <Button variant="contained" color="secondary" className={classes.button}>
                  Sell
                </Button>
              </Typography>
            } 
          />
        </Card>
      </Paper>
    </Fragment>
  );
};

export default withStyles(styles)(CommunityBanner);
