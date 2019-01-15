/**
 *
 * CommunityBanner
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Card, CardHeader, CardMedia, Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';


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
  fullWidth: {
    display: 'fixed',
  },
  media: {
    height: 400,
    width: 'auto',
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
  descriptionStyle: {
    fontSize: 'medium'
  },
});

interface OwnProps {
  classes: any;
  logo: string;
  name: string;
  tokenSymbol: string;
  tokenValueSymbol: string;
  value: number;
  description: string;
}

const CommunityBanner: React.SFC<OwnProps> = (props: OwnProps) => {
  const { classes, name, logo, tokenSymbol, value, tokenValueSymbol, description } = props;

  return (
    <Fragment>
      <Card className={classes.fullWidth}>

        <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button variant="raised" color="primary" className={classes.buttonTop}>
            Back
          </Button>
        </NavLink>
        <CardMedia
          className={classes.media}
          image={logo}
          title={name} />
        <CardHeader
          title={name}
          subheader={
            <Typography>
              1 {tokenSymbol} ~ {value} {tokenValueSymbol}
              <p className={classes.descriptionStyle}>
                {description}
              </p>
              <Button variant="contained" color="primary" className={classes.button}>
                Sell
              </Button>
              <Button variant="contained" color="secondary" className={classes.button}>
                Buy
              </Button>
            </Typography>
          }
        />

      </Card>
    </Fragment>
  );
};

export default withStyles(styles)(CommunityBanner);
