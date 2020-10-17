/**
 * WordPress dependencies
 */
import '@wordpress/format-library';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { serialize, parse } from '@wordpress/blocks';
import { uploadMedia } from '@wordpress/media-utils';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	BlockInspector,
	WritingFlow,
	ObserveTyping,
} from '@wordpress/block-editor';

/**
 * External dependencies
 */
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import { makeStyles } from "@material-ui/core/styles";

/**
 * Internal dependencies
 */
import Sidebar from '../sidebar';

//TODO Implement block persistence with email data store.
//TODO Potentially use our own alerts data store (core).

const useStyles = makeStyles((theme) => ({
    subjectInputs: {
		width: "100%",
		padding: '.5em 0'
    },
  }));

function BlockEditor( { settings: _settings } ) {
	const [ blocks, updateBlocks ] = useState( [] );
	const { createInfoNotice } = useDispatch( 'core/notices' );
	const classes = useStyles();
	const canUserCreateMedia = useSelect( ( select ) => {
		const _canUserCreateMedia = select( 'core' ).canUser( 'create', 'media' );
		return _canUserCreateMedia || _canUserCreateMedia !== false;
	}, [] );

	const settings = useMemo(() => {
		if ( ! canUserCreateMedia ) {
			return _settings;
		}
		return {
			..._settings,
			mediaUpload( { onError, ...rest } ) {
				uploadMedia( {
					wpAllowedMimeTypes: _settings.allowedMimeTypes,
					onError: ( { message } ) => onError( message ),
					...rest,
				} );
			},
		};
	}, [ canUserCreateMedia, _settings ] );

	useEffect( () => {
		const storedBlocks = window.localStorage.getItem( 'groundhoggBlocks' );

		if ( storedBlocks?.length ) {
			handleUpdateBlocks(() => parse(storedBlocks));
		}
	}, [] );

	function handleUpdateBlocks(blocks) {
		updateBlocks( blocks );
	}

	function handlePersistBlocks( newBlocks ) {
		updateBlocks( newBlocks );
		window.localStorage.setItem( 'groundhoggBlocks', serialize( newBlocks ) );
	}

	return (
		<div className="groundhogg-block-editor">
			<BlockEditorProvider
				value={ blocks }
				settings={ settings }
				onInput={ handleUpdateBlocks }
				onChange={ handlePersistBlocks }
			>
				<Grid container spacing={3}>
					<Grid item xs={9}>
						<TextField className={ classes.subjectInputs } value="Subject" />
						<TextField className={ classes.subjectInputs } placeholder={ __( 'Pre Header Text: Used to summarize the content of the email.' ) } />
						<Paper>
							<div className="editor-styles-wrapper">
								<BlockEditorKeyboardShortcuts />
								<WritingFlow>
									<ObserveTyping>
										<BlockList className="groundhogg-block-editor__block-list" />
									</ObserveTyping>
								</WritingFlow>
							</div>
						</Paper>
					</Grid>
					<Sidebar.InspectorFill>
						<BlockInspector />
					</Sidebar.InspectorFill>
				</Grid>
			</BlockEditorProvider>
		</div>
	);
}

export default BlockEditor;