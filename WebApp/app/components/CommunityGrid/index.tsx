/**
 *
 * CommunityGrid
 *
 */

import { GridList, GridListTile, ListSubheader } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import CommunityCard, {OwnProps as CommunityCardProps} from 'components/CommunityCard';
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
  communities: CommunityCardProps[];
}

interface StyleProps {
  classes: any;
  width: Breakpoint;
}

type Props = OwnProps & StyleProps;

function CommunityGrid(props: Props) {
  const { classes, communities, width } = props;

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
            <ListSubheader component="div">Communities</ListSubheader>
          </GridListTile>
          {communities.map(c => (
            <GridListTile key={c.id} className={classes.gridListTile}>
              <CommunityCard {...c} />
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
)(CommunityGrid);
