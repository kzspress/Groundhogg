/**
 * External dependencies
 */
import { Component, Suspense } from '@wordpress/element';
import { parse } from 'qs';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';


/**
 * Internal dependencies
 */
import {
	Dashboard,
	Reports,
	Emails,
	Tags,
	Contacts,
	Funnels,
	Settings,
	Broadcasts,
	Tools
} from './pages'

import { Spinner } from '../../components';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import EmailIcon from '@material-ui/icons/Email';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import SettingsInputAntennaSharpIcon from '@material-ui/icons/SettingsInputAntennaSharp';
import BuildIcon from '@material-ui/icons/Build';

export const PAGES_FILTER = 'groundhogg.navigation';

export const getPages = () => {
	let pages = [];

	/** @TODO: parse/hydrate PHP-registered nav items for app navigation */

	pages.push( {
		component: Dashboard,
		icon : DashboardIcon,
		label: __( 'Dashboard' ),
		name: 'dashboard',
		path: '/',
		priority: 1
	} );

	pages.push( {
		component: Reports,
		icon : BarChartIcon,
		label: __( 'Reports' ),
		name: 'reports',
		path: '/reports',
		priority: 10
	} );


	pages.push( {
		component: Broadcasts,
		icon : SettingsInputAntennaSharpIcon,
		label: __( 'Broadcasts' ),
		name: 'broadcasts',
		path: '/broadcasts',
		priority: 20
	} );

	pages.push( {
		component: Contacts,
		icon : PeopleIcon,
		label: __( 'Contacts' ),
		path: '/contacts',
		name: 'contacts',
		priority: 20
	} );

	pages.push( {
		component: Tags,
		icon : LocalOfferIcon,
		label: __( 'Tags' ),
		name: 'tags',
		path: '/tags',
		priority: 30
	} );

	pages.push( {
		component: Emails,
		icon : EmailIcon,
		label: __( 'Emails' ),
		name: 'reports',
		path: '/emails',
		priority: 40
	} );

	pages.push( {
		component: Funnels,
		icon : LinearScaleIcon,
		label: __( 'Funnels' ),
		name: 'funnels',
		path: '/funnels',
		priority: 50
	} );

	pages.push( {
		component: Tools,
		icon : BuildIcon,
		label: __( 'Tools' ),
		name: 'tools',
		path: '/tools',
		priority: 55
	} );

	pages.push( {
		component: Settings,
		icon : SettingsIcon,
		label: __( 'Settings' ),
		name: 'settings',
		path: '/settings',
		priority: 60
	} );

	pages = applyFilters(
		PAGES_FILTER,
		pages
	);

	pages.sort((a, b) => (a.priority > b.priority) ? 1 : -1)

	return pages;
};

export class Controller extends Component {

	getQuery( searchString ) {
		if ( ! searchString ) {
			return {};
		}

		const search = searchString.substring( 1 );
		return parse( search );
	}

	render() {
		const { page, match, location } = this.props;
		const { url, params } = match;
		const query = this.getQuery( location.search );

		return (
			<Suspense fallback={ <Spinner /> }>
				<page.component
					params={ params }
					path={ url }
					pathMatch={ page.path }
					query={ query }
				/>
			</Suspense>
		);
	}
}
