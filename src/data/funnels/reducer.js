/**
 * Internal dependencies
 */
import TYPES from './action-types';

const funnelsReducer = (
	state = {
		isUpdating: false,
		isRequesting: false,
		items: [],
		item: null,
		requestingErrors: {}
	},
	{ type, items, error, isUpdating, isRequesting, name, item }
) => {
	switch ( type ) {
		case TYPES.RECEIVE_FUNNEL:
			state = {
				...state,
				item : item
			};
			break;
		case TYPES.RECEIVE_FUNNELS:
			state = {
				...state,
				items : items.map( ( item ) => { return item.data } )
				// items : items.item
			};
			break;
		case TYPES.SET_IS_UPDATING:
			state = {
				...state,
				...items,
				isUpdating,
			};
		break;
		case TYPES.SET_IS_REQUESTING:
			state = {
				...state,
				...items,
				isRequesting,
			};
			break;
		case TYPES.SET_REQUESTING_ERROR:
			state = {
				...state,
				requestingErrors: {
					[ name ]: error,
				},
			};
			break;
		case TYPES.SET_UPDATING_ERROR:
			state = {
				...state,
				error,
				updatingError: error,
				isUpdating: false,
			};
			break;
	}
	return state;
};

export default funnelsReducer;