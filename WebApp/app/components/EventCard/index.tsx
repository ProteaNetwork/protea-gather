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

// import styled from 'styles/styled-components';
const styles = ({ palette, spacing }: Theme) => createStyles({
  card: {
    width: 400,
    height: 370,
  },
  cardContent: {
    backgroundColor: palette.secondary.light,
  },
  media: {
    width: '100%',
    height: 300,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  chip: {
    margin: spacing.unit,
    float: 'left',
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
});

export interface OwnProps {
  classes: any;
  eventName: string;
  eventID: string;
  image: string;
  comLogo: string;
  displayCommunityName: boolean;
  onClick(id: string): void;
}


function EventCard(props: OwnProps) {
  const { classes, eventName, eventID, image, comLogo, displayCommunityName = true } = props;
  return (
    <Card className={classes.card}>
      <Link to="/event" className={classes.link} >
        <CardActionArea onClick={() => props.onClick(eventID)}>
          {displayCommunityName &&
            <Chip
              avatar={<Avatar alt="Community Name" src={comLogo} />}
              label="Community Name"
              className={classes.chip}
            />
          }
          <CardMedia
            className={classes.media}
            image={image}
            title={eventName}
          />
          <CardContent className={classes.cardContent}>
            <Typography className={classes.header} gutterBottom variant="h5" component="h2">
              {eventName}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default withStyles(styles)(EventCard);
