import EmailIcon from '@material-ui/icons/Email';

import { ACTION } from '../../constants'
import { registerStepType } from 'data/step-type-registry'

const STEP_TYPE = 'send_email'

const stepAtts = {

  type: STEP_TYPE,

  group: ACTION,

  name: 'Send Email',

  icon: <EmailIcon/>,

  view: ({data, meta, stats}) => {
    return <></>
  },
  edit: ({data, meta, stats}) => {
    return <></>
  },
}

registerStepType( STEP_TYPE, stepAtts );