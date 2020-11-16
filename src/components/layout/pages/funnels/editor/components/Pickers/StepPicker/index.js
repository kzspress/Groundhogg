import { useState } from 'react'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField/TextField'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import { select, useDispatch, useSelect } from '@wordpress/data'

/**
 * Internal dependencies
 */
import {
  FUNNELS_STORE_NAME, STEP_TYPES_STORE_NAME,
} from 'data'
import { getStepType } from 'data/step-type-registry'

const useStyles = makeStyles((theme) => ( {
  box: {
    padding: theme.spacing(1),
  },
  stepPaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
} ))

const SelectStepButton = ({ type, onSelect }) => {

  const { name, icon } = type
  return (
    <Button
      size={ 'medium' }
      variant={ 'outlined' }
      onClick={ () => onSelect(type.type) }
      startIcon={ icon }
    >
      { name }
    </Button>
  )
}

export default (props) => {

  const {
    steps,
    stepGroup,
    edges,
    closePicker,
  } = props

  const classes = useStyles()
  const [search, setSearch] = useState('')
  const { createStep, updateStep } = useDispatch(FUNNELS_STORE_NAME)
  const { funnelId } = useSelect((select) => {
    return {
      funnelId : select( FUNNELS_STORE_NAME ).getCurrentId()
    }
  }, [])

  // reduce step types into rows of three
  const reducer = (acc, curr) => {
    if (acc.length > 0 && acc[acc.length - 1].length < 3) {
      acc[acc.length - 1].push(curr)
    }
    else {
      acc.push([curr])
    }
    return acc
  }

  const handleTypeChosen = (type) => {

    const StepType = getStepType( type );

    // Create the step
    const newStepData = {
      step_type: type,
      step_group: stepGroup,
    }
    createStep({
      data: newStepData,
      edges: StepType.edgesFilter ? StepType.edgesFilter( edges ) : edges
    }, funnelId)

    closePicker && closePicker()
  }

  return (
    <Box className={ classes.box }>
      <Box className={ classes.box }>
        <TextField
          value={ search }
          onChange={ (e) => setSearch(e.target.value) }
          label={ 'Search' }
          type={ 'search' }
          variant={ 'outlined' }
          size={ 'small' }
          fullWidth
        />
      </Box>
      <Box className={ classes.box }>
        <Grid container spacing={ 2 }>
          {
            steps.filter(item => item.name.match(new RegExp(search, 'i'))).
              reduce(reducer, []).
              map(row => {
                return (
                  <Grid container item xs={ 12 } spacing={ 2 }>
                    {
                      row.map(item => {
                        return (
                          <Grid item xs={ 4 }>
                            <SelectStepButton
                              type={ item }
                              onSelect={ handleTypeChosen }
                            />
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                )
              })
          }
        </Grid>
      </Box>
    </Box>
  )
}
