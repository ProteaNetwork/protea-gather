/**
 *
 * EventGrid
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { GridListTile, GridList, ListSubheader } from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import EventCard, {OwnProps as EventCardProps} from 'components/EventCard';
import { compose } from 'redux';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

const styles = () => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridListTile: {
    height: 400,
  }
});

interface OwnProps {
  events: Array<EventCardProps>;
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
  }

  return (
    <Fragment>
      <main className={classes.root}>
        <GridList cellHeight='auto' spacing={10} cols={getGridListCols()}>
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
