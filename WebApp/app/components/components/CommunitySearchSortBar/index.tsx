import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, Paper } from '@material-ui/core';

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

function CommunitySearchSortBar(props: OwnProps) {
  const { classes, searchParameter, sortParameter, onChange } = props;

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <FormControl className={classes.formControl}> {/*variant='outlined'*/}
          <TextField
            id="search-parameter"
            name='searchParameter'
            label="Search"
            className={classes.textField}
            value={searchParameter}
            onChange={onChange}
            variant='outlined' />
        </FormControl>
        <FormControl className={classes.formControl}> {/*variant='outlined'*/}
          <InputLabel htmlFor="outlined-age-simple">
            Sort
          </InputLabel>
          <Select
            value={sortParameter}
            onChange={onChange}
            name='sortParameter'
            input={
              <OutlinedInput
                labelWidth={20}
                name="sortParameter"
                id="outlined-age-simple" />} >
            <MenuItem value={1}>Name</MenuItem>
            <MenuItem value={2}>Tokens</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </Fragment>
  );
}

export default withStyles(styles)(CommunitySearchSortBar);
