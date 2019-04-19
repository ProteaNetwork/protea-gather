/**
 *
 * CommunityCard
 *
 */

import { Card, CardActionArea, CardContent, CardMedia, Theme, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import {Link} from 'react-router-dom';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { colors } from 'theme';
import Blockies from 'react-blockies';

const styles = ({ palette, breakpoints, spacing }: Theme) => createStyles({
  card: {
    width: 400,
    height: 'auto',
  },
  cardContent: {
    backgroundColor: colors.proteaBranding.blackBg,
    color: colors.white,
    textOverflow: 'ellipsis',
  },
  media: {
    width: '100%',
    height: 200,
    // 200px
    overflow: 'hidden',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    [breakpoints.up("xs")]: {
      height: 150
    },
    [breakpoints.up("sm")]: {
      height: 300
    },
    '& canvas':{
      objectPosition: "center",
      objectFit: "cover",
      minWidth: "100%",
    }
  },
  header: {
    width: '100%',
    height: 30,
    marginBottom: 0,
    overflow: "hidden",
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    textDecoration: 'none',
    color: colors.white
  },
});

export interface OwnProps {
  name: string;
  availableStake: number;
  bannerImage: string;
  comLogo: string;
  tbcAddress: string;
}

interface StyleProps {
  classes: any;
}

type Props = OwnProps & StyleProps;

function CommunityCard(props: Props) {
  const { classes, availableStake, bannerImage, name,  tbcAddress } = props;
  return (
    <Card className={classes.card}>
      <Link to={`/communities/${tbcAddress}`} className={classes.link} >
        <CardActionArea>
          {
            bannerImage && <CardMedia
            className={classes.media}
            image={apiUrlBuilder.attachmentStream(bannerImage)}
            title={name} />
          }
          {
            !bannerImage && <section className={classes.media}>
              <Blockies
                seed={tbcAddress ? tbcAddress : "0x"}
                size={105}
                scale={4}
                color={colors.proteaBranding.orange}
                bgColor={colors.white}
                spotColor={colors.proteaBranding.pink}

              />
            </section>
          }
          <CardContent className={classes.cardContent}>
            <Typography color="inherit" className={classes.header} variant="h5" component="h2" gutterBottom>
              {name}
            </Typography>
            <Typography color="inherit">
              Available Stake: {parseFloat(`${availableStake}`).toFixed(2)} DAI
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default withStyles(styles)(CommunityCard);

