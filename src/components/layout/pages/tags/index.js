/**
 * External dependencies
 */
import { Fragment, useState } from '@wordpress/element'
import { useSelect, useDispatch } from '@wordpress/data'
import { ListTable } from '../../../core-ui/list-table/new'
import { TAGS_STORE_NAME } from '../../../../data/tags'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import DeleteIcon from '@material-ui/icons/Delete'
import SettingsIcon from '@material-ui/icons/Settings'
import GroupIcon from '@material-ui/icons/Group'
import RowActions from '../../../core-ui/row-actions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'

const iconProps = {
  fontSize: 'small',
  style: {
    verticalAlign: 'middle',
  },
}

const tagTableColumns = [
  {
    ID: 'tag_id',
    name: 'ID',
    orderBy: 'tag_id',
    align: 'right',
    cell: ({ data, ID }) => {
      return data.tag_id
    },
  },
  {
    ID: 'name',
    name: <span><LocalOfferIcon { ...iconProps }/> { 'Name' }</span>,
    orderBy: 'tag_name',
    align: 'left',
    cell: ({ data }) => {
      return <>{ data.tag_name }</>
    },
  },
  {
    ID: 'description',
    name: <span>{ 'Description' }</span>,
    align: 'left',
    cell: ({ data }) => {
      return <>{ data.tag_description }</>
    },
  },
  {
    ID: 'contacts',
    name: <span><GroupIcon { ...iconProps }/> { 'Contacts' }</span>,
    orderBy: 'contact_count',
    align: 'right',
    cell: ({ data }) => {
      return <>{ data.contact_count }</>
    },
  },
  {
    ID: 'contacts',
    name: <span><SettingsIcon { ...iconProps }/> { 'Actions' }</span>,
    align: 'right',
    cell: ({ ID, data, openQuickEdit }) => {

      const { deleteItem } = useDispatch(TAGS_STORE_NAME)

      const handleEdit = () => {
        openQuickEdit()
      }

      const handleDelete = (ID) => {
        deleteItem(ID)
      }

      return <>
        <RowActions
          onEdit={ openQuickEdit }
          onDelete={ () => handleDelete(ID) }
        />
      </>
    },
  },
]

// Styling for inputs
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
    '& .MuiButtonBase-root:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
}));

/**
 * Handle the table quick edit
 *
 * @param ID
 * @param data
 * @param exitQuickEdit
 * @returns {*}
 * @constructor
 */
const TagsQuickEdit = ({ ID, data, exitQuickEdit }) => {

  const classes = useStyles();
  const { updateItem } = useDispatch(TAGS_STORE_NAME)
  const [tempState, setTempState] = useState({
    ...data,
  })

  /**
   * Store the changes in a temp state
   *
   * @param atts
   */
  const handleOnChange = (atts) => {
    setTempState({
      ...tempState,
      ...atts,
    })
  }

  /**
   * Commit the changes
   */
  const commitChanges = () => {
    updateItem(ID, {
      data: tempState,
    })
    exitQuickEdit()
  }

  return (
    <Box display={ 'flex' } justifyContent={ 'space-between' } className={classes.root}>
      <Box flexGrow={ 2 }>
        <TextField
          label={ 'Tag Name' }
          id="tag-name"
          fullWidth
          value={ tempState && tempState.tag_name }
          onChange={ (e) => handleOnChange({ tag_name: e.target.value }) }
          variant="outlined"
          size="small"
        />
        <TextField
          id="tag-description"
          label={'Tag Description'}
          multiline
          fullWidth
          rows={2}
          value={tempState && tempState.tag_description }
          onChange={ (e) => handleOnChange({ tag_description: e.target.value }) }
          variant="outlined"
        />
      </Box>
      <Box flexGrow={ 1 }>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button variant="contained" color="primary" onClick={ commitChanges }>
            { 'Save Changes' }
          </Button>
          <Button variant="contained" onClick={exitQuickEdit}>
            { 'Cancel' }
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const tagTableBulkActions = [
  {
    title: 'Delete',
    action: 'delete',
    icon: <DeleteIcon/>,
  },
]

export const Tags = () => {

  const { items, totalItems, isRequesting } = useSelect((select) => {
    const store = select(TAGS_STORE_NAME)

    return {
      items: store.getItems(),
      totalItems: store.getTotalItems(),
      isRequesting: store.isItemsRequesting(),
    }
  }, [])

  const { fetchItems, deleteItems } = useDispatch(TAGS_STORE_NAME)

  /**
   * Handle any bulk actions
   *
   * @param action
   * @param selected
   * @param setSelected
   * @param fetchItems
   */
  const handleBulkAction = ({ action, selected, setSelected, fetchItems }) => {
    switch (action) {
      case 'delete':
        deleteItems(selected.map(item => item.ID))
        setSelected([])
        break
    }
  }

  return (
    <Fragment>
      <ListTable
        items={ items }
        defaultOrderBy={ 'tag_id' }
        defaultOrder={ 'desc' }
        totalItems={ totalItems }
        fetchItems={ fetchItems }
        isRequesting={ isRequesting }
        columns={ tagTableColumns }
        onBulkAction={ handleBulkAction }
        bulkActions={ tagTableBulkActions }
        QuickEdit={ TagsQuickEdit }
      />
    </Fragment>
  )
}