import React from 'react'
import { useEffect, useState } from '@wordpress/element'
import { useSelect, useDispatch } from '@wordpress/data'
import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell/TableCell'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableBody from '@material-ui/core/TableBody'
import Paper from '@material-ui/core/Paper'
import TablePagination from '@material-ui/core/TablePagination'
import Spinner from '../spinner'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'

export function ListTable ({ defaultOrderBy, defaultOrder, columns, items, totalItems, fetchItems, isLoadingItems, bulkActions, onBulkAction }) {

  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState(defaultOrder)
  const [orderBy, setOrderBy] = useState(defaultOrderBy)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')

  const __fetchItems = () => {
    fetchItems({
      limit: perPage,
      offset: perPage * page,
      orderBy: orderBy,
      order: order,
      search: search
    })
  }

  /**
   * When select all occurs
   */
  const handleSelectAll = () => {
    setSelected( selected.length === items.length ? [] : items );
  }

  /**
   * If an item is selected
   *
   * @param item
   * @returns {boolean}
   */
  const isSelected = (item) => {
    return selected.filter( __item => __item.ID === item.ID ).length > 0;
  }

  /**
   * Select an item
   *
   * @param item
   */
  const handleSelectItem = ( item ) => {
    if ( isSelected( item ) ){
      // Item is selected, so remove it
      setSelected( selected.filter( __item => __item.ID !== item.ID ) )
    } else {
      // Add it to the selected array
      setSelected( [ ...selected, item ] )
    }
  }

  /**
   * Handle a bulk action
   *
   * @param e
   * @param action
   */
  const handleBulkAction = ( e, action ) => {
    onBulkAction( action, selected  )
  }

  useEffect(() => {
    __fetchItems()
  }, [
    perPage,
    page,
    order,
    orderBy,
    search
  ])

  /**
   * Handle the search results
   *
   * @param e
   */
  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  /**
   * Handle the update of the orderBy
   *
   * @param __orderBy
   */
  const handleReOrder = (__orderBy) => {
    // If the current column used for ordering is the same one as was chosen
    // already
    if (__orderBy === orderBy) {
      setOrder(order === 'desc' ? 'asc' : 'desc')
    }
    else {
      setOrderBy(__orderBy)
    }
  }

  /**
   * Handle the changing of the number of items per page
   *
   * @param event
   */
  const handlePerPageChange = (event) => {
    const __perPage = event.target.value
    setPerPage(__perPage )

    // Handle per page being larger than available data
    if ( totalItems / __perPage < page ){
      setPage( Math.floor( totalItems / __perPage ) )
    }
  }

  /**
   * Handle the change of the page
   *
   * @param e
   * @param __page
   */
  const handlePageChange = (e, __page) => {
    setPage(__page)
  }

  if (!items || isLoadingItems) {
    return <Spinner/>
  }

  return (
    <>
      <Paper>
        <TableToolbar
          numSelected={ selected.length }
          search={search}
          onSearch={handleSearch}
        />
        <TableContainer>
          <Table size={ 'medium' }>
            <TableHeader
              handleReOrder={ handleReOrder }
              onSelectAll={handleSelectAll}
              columns={ columns }
              order={ order }
              orderBy={ orderBy }
              numSelected={ selected.length }
              perPage={perPage}
              totalItems={totalItems}
            />
            <TableBody>
              { items &&
              items.map(item => {

                return (
                  <TableRow key={ item.ID }>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={ isSelected( item ) }
                        onChange={ () => handleSelectItem( item ) }
                        inputProps={ { 'aria-label': 'select' } }
                      />
                    </TableCell>
                    { columns.map(col => <TableCell align={ col.align }>
                      <col.cell { ...item }/>
                    </TableCell>) }
                  </TableRow>
                )
              })
              }
            </TableBody>
          </Table>
          { items &&
          <TablePagination
            component="div"
            rowsPerPage={ perPage }
            rowsPerPageOptions={ [10, 25, 50, 100] }
            onChangeRowsPerPage={ handlePerPageChange }
            count={ totalItems }
            page={ page }
            onChangePage={ handlePageChange }
          />
          }
        </TableContainer>
      </Paper>
    </>
  )
}

function TableToolbar (props) {

  const { numSelected, tableTitle, search, onSearch } = props

  return (
    <Toolbar>
      { numSelected > 0 ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          { numSelected } selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          { tableTitle }
        </Typography>
      ) }

      { numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      ) : (
        <TextField id="search" label={ 'Search' } type="search"
                   variant="outlined"
                   value={ search }
                   onChange={ onSearch }
        />
      ) }
    </Toolbar>
  )

}

function TableHeader (props) {

  const {
    columns,
    onSelectAll,
    order,
    orderBy,
    numSelected,
    perPage,
    totalItems,
    handleReOrder,
  } = props

  const __totalItems = Math.min( perPage, totalItems );

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={ numSelected > 0 && numSelected < __totalItems }
            checked={ __totalItems > 0 && numSelected === __totalItems }
            onChange={ onSelectAll }
            inputProps={ { 'aria-label': 'select all' } }
          />
        </TableCell>
        {
          columns.map(col => <HeaderTableCell
            column={ col }
            currentOrderBy={ orderBy }
            order={ order }
            handleReOrder={ handleReOrder }
          />)
        }
      </TableRow>
    </TableHead>
  )

}

/**
 * Assume the header type to use
 *
 * @param column
 * @param currentOrderBy
 * @param handleReOrder
 * @param order
 * @returns {*}
 * @constructor
 */
function HeaderTableCell ({ column, currentOrderBy, handleReOrder, order }) {
  const Component = column.orderBy ? SortableHeaderCell : NonSortableHeaderCell
  return <Component { ...column } currentOrderBy={ currentOrderBy }
                    onReOrder={ handleReOrder } order={ order }/>
}

/**
 *
 * A head
 *
 * @param ID
 * @param name
 * @param align
 * @returns {*}
 * @constructor
 */
function NonSortableHeaderCell ({ ID, name, align }) {
  return (
    <TableCell
      key={ ID }
      align={ align }
      padding={ 'default' }
    >
      { name }
    </TableCell>
  )
}

/**
 * A sortable table cell
 *
 * @param ID
 * @param orderBy
 * @param order
 * @param name
 * @param align
 * @param currentOrderBy
 * @param handleReOrder
 * @returns {*}
 * @constructor
 */
function SortableHeaderCell ({ ID, orderBy, order, name, align, currentOrderBy, onReOrder }) {
  return (
    <TableCell
      key={ ID }
      align={ align }
      padding={ 'default' }
      sortDirection={ currentOrderBy === orderBy ? order : false }
    >
      <TableSortLabel
        active={ orderBy === currentOrderBy }
        direction={ orderBy === currentOrderBy ? order : 'asc' }
        onClick={ () => onReOrder(orderBy) }
      >
        { name }
      </TableSortLabel>
    </TableCell>
  )
}