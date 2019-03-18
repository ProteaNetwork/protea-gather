/**
 *
 * EventSearchSortBar
 *
 */

import { FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { Fragment } from 'react';

const styles = theme => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

interface OwnProps {
  classes: any;
}

interface OwnProps {
  classes: any;
  searchParameter: string;
  sortParameter: number;
  onChange(event: { target: { name: string, value: string | number } }): void;
}

function EventSearchSortBar(props: OwnProps) {
  const { classes, searchParameter, sortParameter, onChange } = props;

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            id="search-parameter"
            name="searchParameter"
            label="Search"
            className={classes.textField}
            variant="outlined"
            value={searchParameter}
            onChange={onChange} />
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel htmlFor="outlined-age-simple">
            Sort
          </InputLabel>
          <Select
            value={sortParameter}
            onChange={onChange}
            name="sortParameter"
            input={
              <OutlinedInput
                labelWidth={20}
                name="sortParameter"
                id="outlined-age-simple" />} >
            <MenuItem value={1}>Name</MenuItem>
            <MenuItem value={2}>Max attendees</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </Fragment>
  );
}

export default withStyles(styles)(EventSearchSortBar);

