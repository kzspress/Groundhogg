import React from 'react';
import axios from 'axios';
import { Header } from './components/Header/Header';
import {Editor} from './components/Editor/Editor';

axios.defaults.headers.common['X-WP-Nonce'] = groundhogg_nonces._wprest;

import './master.scss';

function App() {
	return (
		<div className="Groundhogg">
			<Header/>
			<Editor/>
		</div>
	);
}

export default App;

/**
 * Root event function
 *
 * @param hook
 * @param args
 */
export function dispatchEvent( hook, args ){
	const event = new CustomEvent(hook, { detail: args } );
	document.dispatchEvent(event);
}

/**
 * Root event function
 *
 * @param hook
 * @param callback
 */
export function listenForEvent( hook, callback ){
	document.addEventListener(hook, callback );
}

/**
 * Disable body scrolling
 */
export function disableBodyScrolling () {
	jQuery(function ($) {
		$('body').addClass('disable-scrolling');
	});
}

/**
 * Enable body scrolling
 */
export function enableBodyScrolling () {
	jQuery(function ($) {
		$('body').removeClass('disable-scrolling');
	});
}

export function parseArgs (given, defaults) {

	// remove null or empty values from given
	Object.keys(given).forEach((key) => (given[key] == null || given[key] === '') && delete given[key]);

	return {
		...defaults,
		...given,
	};
}

export function uniqId (prefix = '') {
	return prefix + Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);
}

export function objEquals (obj1, obj2) {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}
