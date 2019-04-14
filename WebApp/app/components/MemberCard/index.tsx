/**
 *
 * MemberCard
 *
 */

import { Card, CardContent, CardMedia, Theme, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import apiUrlBuilder from 'api/apiUrlBuilder';
import Blockies from 'react-blockies';
import { colors } from 'theme';

const styles = ({ palette, spacing }: Theme) => createStyles({
  card: {
    width: 400,
  },
  cardContent: {
    backgroundColor: palette.secondary.light,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 2}px ${spacing.unit * 2}px`,
  },
  media: {
    width: '100%',
    height: 300,
  },
  header: {
    width: 400,
    height: 20,
  },
});

interface OwnProps {
  classes: any;
  profileImage: string;
  name: string;
  ethAddress: string;
}

function MemberCard(props: OwnProps) {
  const { classes, ethAddress, profileImage, name } = props;

  return (
    <Fragment>
        <Card className={classes.card}>
          {
            profileImage && <CardMedia
            className={classes.media}
            image={apiUrlBuilder.attachmentStream(profileImage)}
            title={name} />
          }
          {
            !profileImage && <section className={classes.media}>
              <Blockies
                seed={ethAddress ? ethAddress : "0x"}
                size={105}
                scale={4}
                color={colors.proteaBranding.orange}
                bgColor={colors.white}
                spotColor={colors.proteaBranding.pink}

              />
            </section>
          }
          <CardContent className={classes.cardContent}>
            <Typography className={classes.header} variant="h5" component="h2" gutterBottom>
              {name ? name : ethAddress}
            </Typography>
          </CardContent>
        </Card>

    </Fragment>
  );
}

export default withStyles(styles)(MemberCard);
