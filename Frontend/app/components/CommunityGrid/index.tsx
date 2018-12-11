/**
 *
 * CommunityGrid
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { GridListTile, GridList, ListSubheader } from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import CommunityCard, {OwnProps as CommunityCardProps} from 'components/CommunityCard';
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
  communities: Array<CommunityCardProps>;
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
  }

  return (
    <Fragment>
      <main className={classes.root}>
        <GridList cellHeight='auto' spacing={10} cols={getGridListCols()}>
          <GridListTile key="Subheader" cols={getGridListCols()} style={{ height: 'auto'}}>
            <ListSubheader component="div">Communities</ListSubheader>
          </GridListTile>
          {communities.map(c => (
            <GridListTile key={c.id} className={classes.gridListTile}>
              <CommunityCard
                id={c.id}
                logo={c.logo}
                name={c.name}
                key={c.id}
                tokens={c.tokens}
                onClick={c.onClick}/>
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
