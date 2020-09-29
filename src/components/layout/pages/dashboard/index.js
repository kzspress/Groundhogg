/**
 * External dependencies
 */
import {Component, Fragment} from '@wordpress/element';
import {compose} from '@wordpress/compose';
import {withSelect, withDispatch} from '@wordpress/data';
import {__} from '@wordpress/i18n';
import TextField from '@material-ui/core/TextField';
import {castArray} from 'lodash';
import Spinner from '../../../core-ui/spinner';

/**
 * Internal dependencies
 */
import {TAGS_STORE_NAME} from '../../../../data';
import {BROADCASTS_STORE_NAME} from '../../../../data';

class Dashboard extends Component {

	constructor() {
		super( ...arguments );
		this.onSubmit = this.onSubmit.bind( this );
		this.setValue = this.setValue.bind( this );
		this.state = {
			tagValue : '',
			tags : []
		};
	}

	setValue( event ) {
		this.setState( {
			tagValue : event.target.value
		} )
	}

	async onSubmit() {
		const {
			tagValue
		} = this.state;

		const {
			updateTags,
			tags
		} = this.props;

		if ( tags.tags.length ) {
			this.setState( { tags : tags } );
		}

		const updatingTags = updateTags( { tags : tagValue } )

		console.log(updatingTags);

		this.setState( { tags : updatingTags } );
	}

	render() {

		const { isUpdateRequesting } = this.props;
		const tags = castArray( this.props.tags.tags );

		return (
				<Fragment>
					<h2>Dashboard</h2>
					<ol>
					{
						tags.map( ( tag ) => {
							return( <li>{tag.tag_name}</li> )
						} )
					}
					</ol>
					<TextField id="outlined-basic" label="Add Tags" variant="outlined" />
					<p onClick={this.onSubmit}>Add</p>
					{ ( isUpdateRequesting ) && (
						<Spinner />
					) }
				</Fragment>
		);
	}
}

// default export
export default compose(
	withSelect( ( select ) => {
		const {
			getTags,
			isTagsUpdating
		} = select( TAGS_STORE_NAME );

		const isUpdateRequesting = isTagsUpdating();
		const tags = getTags();

		return {
			tags,
			isUpdateRequesting
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { updateTags } = dispatch( TAGS_STORE_NAME );
		return {
			updateTags
		};
	} )
)( Dashboard );



/*
* COde
* */

//
// render() {
//
// 	const tags = castArray(this.props.tags.tags);
// 	const broadcasts = castArray(this.props.broadcasts.broadcasts);
// 	return (
// 		<div>
// 			<Fragment>
// 				<h2>Dashboard</h2>
// 				<ol>
// 					{
// 						tags.map((tag) => {
// 							return (<li>{tag.tag_name}</li>)
// 						})
// 					}
// 				</ol>
// 				<TextField id="outlined-basic" label="Add Tags" variant="outlined" onKeyUp={this.setValue}/>
// 				<p onClick={this.onSubmit}>Add</p>
// 			</Fragment>
// 			<Fragment>
// 				<h2>BroadCast</h2>
// 				<ol>
// 					{
// 						broadcasts.map((broadcast) => {
// 							return (<li>{broadcast.title}</li>)
// 						})
// 					}
// 				</ol>
//
// 			</Fragment>
// 		</div>
// 	);
// }
// }
//
// // default export
// export default compose(
// 	withSelect((select) => {
// 		const {
// 			getTags,
// 			isTagsUpdating
// 		} = select(TAGS_STORE_NAME);
//
// 		const {
// 			getBroadcasts,
// 		} = select(BROADCASTS_STORE_NAME);
//
// 		const tags = getTags();
// 		const tagUpdate = isTagsUpdating();
// 		const broadcasts = getBroadcasts();
// 		return {
// 			tags,
// 			broadcasts,
// 			tagUpdate,
// 			// broadcastUpdate
// 		};
// 	}),
// 	withDispatch((dispatch) => {
// 		const {updateTags} = dispatch(TAGS_STORE_NAME);
// 		const {updateBroadcasts} = dispatch(BROADCASTS_STORE_NAME);
// 		return {
// 			updateTags,
// 			updateBroadcasts
// 		};
// 	})
// )(Dashboard);
