/**
 *
 * CommunityCard
 *
 */

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Theme, CardMedia, CardActionArea } from '@material-ui/core';
import {Link} from 'react-router-dom';

const styles = ({ palette }: Theme) => createStyles({
  card: {
    width: 400,
    height: 'auto',
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
  header: {
    width: 400,
    height: 20,
  },
  link: {
    textDecoration: 'none',
  }
});

export interface OwnProps {
  name: string;
  tokens: number;
  logo: string;
  id: string;
  onClick(id: string): void;
}

interface StyleProps {
  classes: any;
}

type Props = OwnProps & StyleProps;

function CommunityCard(props: Props) {
  const { classes, tokens, logo, name, id } = props;
  return (
    <Card className={classes.card}>
      <Link to='/community' className={classes.link} >
        <CardActionArea onClick={() => props.onClick(id)} >
          <CardMedia
            className={classes.media}
            image={logo}
            title={name} />
          <CardContent className={classes.cardContent}>
            <Typography className={classes.header} variant="h5" component="h2" gutterBottom>
              {name}
            </Typography>
            <Typography color="textSecondary">
              Tokens: {tokens}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default withStyles(styles)(CommunityCard);

