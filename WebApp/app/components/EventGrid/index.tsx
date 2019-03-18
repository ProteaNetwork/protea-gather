/**
 *
 * EventGrid
 *
 */

import { GridList, GridListTile, ListSubheader } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import EventCard, {OwnProps as EventCardProps} from 'components/EventCard';
import React, { Fragment } from 'react';
import { compose } from 'redux';

const styles = () => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridListTile: {
    height: 400,
  },
});

interface OwnProps {
  events: EventCardProps[];
}

interface StyleProps {
  classes: any;
  width: Breakpoint;
}

type Props = OwnProps & StyleProps;

function EventGrid(props: Props) {
  const { classes, events, width } = props;

  const getGridListCols = () => {
    if (isWidthUp('xl', width)) {
      return 4;
    }

    if (isWidthUp('lg', width)) {
      return 3;
    }

    if (isWidthUp('md', width)) {
      return 2;
    }

    return 1;
  };

  return (
    <Fragment>
      <main className={classes.root}>
        <GridList cellHeight="auto" spacing={10} cols={getGridListCols()}>
          <GridListTile key="Subheader" cols={getGridListCols()} style={{ height: 'auto'}}>
            <ListSubheader component="div">Events</ListSubheader>
          </GridListTile>
          {events.map(e => (
            <GridListTile key={e.eventID} className={classes.gridListTile}>
              <EventCard {...e} />
            </GridListTile>
          ))}
        </GridList>
      </main>
    </Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(EventGrid);
