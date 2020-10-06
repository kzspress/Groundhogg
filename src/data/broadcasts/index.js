/**
 * Internal dependencies
 */
import {
  registerBaseObjectStore,
  getStoreName
} from '../base-object';

const STORE_NAME = 'broadcasts';

registerBaseObjectStore( STORE_NAME );

export const BROADCASTS_STORE_NAME = getStoreName( STORE_NAME );
