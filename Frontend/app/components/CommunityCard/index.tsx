/**
 *
 * CommunityCard
 *
 */

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {CardActionArea, CardContent, CardMedia, Typography }from '@material-ui/core';

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
  name: string;
  tokens: number;
  logo: string;
  id: string;
  onClick(id: string): void;
}

function CommunityCard(props: OwnProps) {
  const { classes, id, logo, tokens, name } = props;
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => props.onClick(id)}>
        <CardMedia
          className={classes.media}
          image= {logo}
          title= {name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography component="p">
            Tokens: {tokens}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withStyles(styles)(CommunityCard);

