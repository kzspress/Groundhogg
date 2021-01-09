/**
 * Internal dependencies
 */
import BaseActions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

import {
	registerBaseObjectStore,
	getStoreName
} from '../base-object';

const STORE_NAME = 'funnels';

const actions = new BaseActions( STORE_NAME );

registerBaseObjectStore( STORE_NAME, {
	reducer,
	actions,
	selectors
} );

export const FUNNELS_STORE_NAME = getStoreName( STORE_NAME );