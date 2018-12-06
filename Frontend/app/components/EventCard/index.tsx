/**
 *
 * EventCard
 *
 */

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';

// import styled from 'styles/styled-components';
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
};

export interface OwnProps {
  classes: any;
  eventName: string;
  eventID: string;
  image: string;
  comLogo: string;
  onClick(id: string): void;
}

function EventCard(props: OwnProps) {
  const { classes, eventName, eventID, image } = props;
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => props.onClick(eventID)}>
        <CardMedia
          className={classes.media}
          image={image}
          title={eventName}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {eventName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withStyles(styles)(EventCard);
