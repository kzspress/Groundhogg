import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import {
  ACTIONS, ADD_STEP_BUTTON_X_OFFSET, ADD_STEP_BUTTON_Y_OFFSET,
  ARROW_STYLE,
  BENCHMARK, CARD_HEIGHT,
  CARD_WIDTH,
  CONDITION,
} from '../../constants'
import { registerStepType } from 'data/step-type-registry'
import Xarrow from 'react-xarrows'
import { makeStyles } from '@material-ui/core/styles'
import { NODE_HEIGHT, NODE_WIDTH } from 'components/layout/pages/funnels/editor'
import {
  BENCHMARKS,
  CONDITIONS,
} from 'components/layout/pages/funnels/editor/steps-types/constants'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import AddStepButton
  from 'components/layout/pages/funnels/editor/components/AddStepButton'
import {
  getChildren,
  getParents,
  isBenchmark,
} from 'components/layout/pages/funnels/editor/functions'

const STEP_TYPE = 'yes_no_condition'

const CONDITION_ADD_STEP_OFFSET = 45

const useStyles = makeStyles((theme) => ( {
  edgeLabel: {
    background: '#ffffff',
    padding: theme.spacing(1),
    border: '1px solid',
    borderRadius: 3,
  },
  edgeNo: {
    background: '#F8D7DA',
    borderColor: '#f5c6cb',
    color: '#721c24',
  },
  edgeYes: {
    background: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724',
  },
} ))

const stepAtts = {

  type: STEP_TYPE,

  group: CONDITION,

  name: 'Yes/No',

  icon: <LocalOfferIcon/>,

  view: ({ data, meta, stats }) => {
    return <></>
  },

  edit: ({ data, meta, stats }) => {
    return <></>
  },

  Edges: ({ data, meta, ID, graph, child_edges }) => {
    // Benchmarks should only ever have 1 child...
    // can have multiple parents though!

    const { edgeLabel, edgeYes, edgeNo } = useStyles()

    let parents = getParents(ID, graph)

    let yesNode = graph.node(child_edges.find(e => e.path === 'yes').to_id)
    let noNode = graph.node(child_edges.find(e => e.path === 'no').to_id)

    const arrows = []

    if (parents.length > 1) {

      // If there are multiple parents we need an edge from the add step button
      // to the top of the card

      arrows.push({
        ...ARROW_STYLE,
        start: `add-step-above-${ ID }`,
        end: `step-card-${ ID }`,
      })
    }

    arrows.push({
      ...ARROW_STYLE,
      start: `step-card-${ ID }`,
      end: `add-step-no-${ ID }`,
      endAnchor: ['top', 'middle'],
      headSize: 0,
      label: {
        middle: (
          <div className={ [edgeLabel, edgeNo].join(' ') }>
            No
          </div>
        ),
      },
    })

    arrows.push({
      ...ARROW_STYLE,
      start: `step-card-${ ID }`,
      end: `add-step-yes-${ ID }`,
      endAnchor: ['top', 'middle'],
      headSize: 0, label: {
        middle: (
          <div className={ [edgeLabel, edgeYes].join(' ') }>
            Yes
          </div>
        ),
      },
    })

    arrows.push({
      ...ARROW_STYLE,
      startAnchor: ['bottom', 'middle'],
      start: `add-step-no-${ ID }`,
      end: noNode.ID
        ? `step-card-${ noNode.ID }`
        : 'add-step-above-exit',
    })

    arrows.push({
      ...ARROW_STYLE,
      startAnchor: ['bottom', 'middle'],
      start: `add-step-yes-${ ID }`,
      end: yesNode.ID
        ? `step-card-${ yesNode.ID }`
        : 'add-step-above-exit',
    })

    return (
      <>
        {
          arrows.map((arrow, i) => <Xarrow
            key={ i }
            { ...arrow }
          />)
        }
      </>
    )
  },

  /**
   * Renders the positions of the add step buttons relevant for this step.
   *
   * @param data
   * @param meta
   * @param ID
   * @param graph
   * @param xOffset
   * @param child_edges
   * @returns {*}
   */
  Targets: ({ data, meta, ID, graph, xOffset, child_edges }) => {

    let parents = getParents(ID, graph)
    let children = getChildren(ID, graph)

    let thisNode = graph.node(ID)
    let yesNode = graph.node(child_edges.find(e => e.path === 'yes').to_id)
    let noNode = graph.node(child_edges.find(e => e.path === 'no').to_id)

    let yesPosY, yesPosX, noPosY, noPosX

    yesPosY = noPosY = thisNode.y + CARD_HEIGHT +
      ( ADD_STEP_BUTTON_Y_OFFSET * 1.5 )

    if (yesNode.x === noNode.x) {
      // case 1: yes/no are the same node
      yesPosX = thisNode.x - CONDITION_ADD_STEP_OFFSET
      noPosX = thisNode.x + NODE_WIDTH - CONDITION_ADD_STEP_OFFSET

    }
    else if (yesNode.x === thisNode.x && noNode.x !== thisNode.x) {
      // case 2: yes is 2 levels down, no is 1 level down
      noPosX = noNode.x + ( NODE_WIDTH / 2 ) - CONDITION_ADD_STEP_OFFSET
      yesPosX = thisNode.x - CONDITION_ADD_STEP_OFFSET

    }
    else if (noNode.x === thisNode.x && yesNode.x !== thisNode.x) {
      // case 3: no is 2 levels down, yes is 1 level down
      yesPosX = yesNode.x + ( NODE_WIDTH / 2 ) - CONDITION_ADD_STEP_OFFSET
      noPosX = thisNode.x - CONDITION_ADD_STEP_OFFSET

    }
    else {
      // cas3 4: yes, no are different and are both down 1 level
      noPosX = noNode.x + ( NODE_WIDTH / 2 ) - CONDITION_ADD_STEP_OFFSET
      yesPosX = yesNode.x + ( NODE_WIDTH / 2 ) - CONDITION_ADD_STEP_OFFSET
    }

    const targets = []

    // Add the YES target
    targets.push({
      id: `add-step-yes-${ ID }`,
      groups: [
        ACTIONS,
        CONDITIONS,
      ],
      parents: [ID],
      children: [yesNode.ID],
      position: {
        x: yesPosX,
        y: yesPosY,
      },
    })

    // Add the NO target
    targets.push({
      id: `add-step-no-${ ID }`,
      groups: [
        ACTIONS,
        CONDITIONS,
      ],
      parents: [ID],
      children: [noNode.ID],
      position: {
        x: noPosX,
        y: noPosY,
      },
    })

    // If there are multiple parents a target must be placed above
    if (parents.length > 1) {

      let allowedGroups = [
        ACTIONS,
        CONDITIONS,
        BENCHMARKS,
      ]

      // cannot include benchmarks if the parents have benchmarks in them...
      // other steps are legal
      if (parents.filter(id => {
        return isBenchmark(id, graph)
      }).length) {
        allowedGroups = allowedGroups.filter(group => group !== BENCHMARKS)
      }

      targets.push({
        id: `add-step-above-${ ID }`,
        groups: allowedGroups,
        parents: parents,
        children: [ID],
        position: {
          x: thisNode.x + ( CARD_WIDTH / 2 ) - ADD_STEP_BUTTON_X_OFFSET,
          y: thisNode.y - ( ADD_STEP_BUTTON_Y_OFFSET * 2 ),
        },
      })
    }

    return (
      <>
        {
          targets.map(({ id, position, groups, parents, children }) =>
            <AddStepButton
              id={ id }
              groups={ groups }
              parents={ parents }
              children={ children }
              position={ {
                x: position.x + xOffset,
                y: position.y,
              } }
            />)
        }
      </>
    )
  },
}

registerStepType(STEP_TYPE, stepAtts)