/**
 *
 * EventCard
 *
 */

import { CardActionArea, CardContent, CardMedia, Theme, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import apiUrlBuilder from 'api/apiUrlBuilder';
import Blockies from 'react-blockies';
import { colors } from 'theme';

// import styled from 'styles/styled-components';
const styles = ({ palette, spacing, breakpoints }: Theme) => createStyles({
  card: {
    width: 400,
    height: 'auto',
  },
  cardContent: {
    backgroundColor: colors.proteaBranding.blackBg,
    color: colors.white
  },
  media: {
    width: '100%',
    height: 200,
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
  chip: {
    backgroundColor: colors.proteaBranding.blackBg,
    color: colors.white,
    position: 'absolute',
    top: 15,
    left: 15
  },
  header: {
    width: '100%',
    height: 35,
    color: 'textSecondary', // TODO: add correct size
    overflow: 'hidden',
  },
  link: {
    textDecoration: 'none',
  },
  chipImage:{
    overflow: 'hidden',
    borderRadius: "60px",
    marginLeft: 3
  },
});

export interface OwnProps {
  classes: any;
  name: string;
  eventId: string;
  bannerImage: string;
  comLogo: string;
  displayCommunityName: boolean;
  communityName: string;
}


function EventCard(props: OwnProps) {
  const { classes, name, communityName, eventId, bannerImage, comLogo, displayCommunityName = true } = props;
  return (
    <Card className={classes.card}>
      <Link to={`/events/${eventId}`} className={classes.link} >
        <CardActionArea>
          {displayCommunityName &&
            (comLogo && <Chip
              avatar={<Avatar alt={communityName} src={apiUrlBuilder.attachmentStream(comLogo)} />}
              label={`${communityName}`}
              className={classes.chip}
              />
            )
            ||
            displayCommunityName && !comLogo &&
            <Chip
              label={`${communityName}`}
              className={classes.chip}
              avatar={<Blockies
                seed={eventId ? eventId : "0x"}
                size={13}
                scale={2}
                color={colors.proteaBranding.orange}
                bgColor={colors.white}
                spotColor={colors.proteaBranding.pink}
                className={classes.chipImage}
              />}

            />


          }
          {
            bannerImage && <CardMedia
            className={classes.media}
            image={apiUrlBuilder.attachmentStream(bannerImage)}
            title={name}
          />
          }
          {
            !bannerImage && <section className={classes.media}>
              <Blockies
                seed={eventId}
                size={105}
                scale={4}
                color={colors.proteaBranding.orange}
                bgColor={colors.white}
                spotColor={colors.proteaBranding.pink}

              />
            </section>
          }

          <CardContent className={classes.cardContent}>
            <Typography  color="inherit"className={classes.header} gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default withStyles(styles)(EventCard);
