import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';
// import green from '@material-ui/core/colors/green';
// import white from '@material-ui/core/colors/white';

const classes = makeStyles((theme) => ({
  root: {
    // display: 'inline-block'
    // display: 'flex',
    // color: 'white',
    // flexWrap: 'wrap',
  },
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    width: '145px',
  },
}));

export default function DatePickers({selectedDate, dateChange, label, id}) {
  // const classes = useStyles();
  // console.log(props);
  console.log('change', selectedDate)
  return (
    <form  noValidate>
      <TextField
        className={classes.textField}
        id={id}
        label={label}
        type='date'

        value={selectedDate}
        onChange={dateChange.bind(this, id)}
        width={150}
        // onChange={(event, x) => {console.log(x, event);}}
        // className={classes.textField}
        // InputLabelProps={{
        //   shrink: true,
        // }}
      />
    </form>
  );
}
