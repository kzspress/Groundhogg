<?php

namespace Groundhogg\Steps\Actions;

use Groundhogg\Contact;
use Groundhogg\Event;
use Groundhogg\HTML;
use Groundhogg\Plugin;
use Groundhogg\Step;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Apply Note
 *
 * Apply a note to a contact through the funnel builder.
 *
 * @package     Elements
 * @subpackage  Elements/Actions
 * @author      Adrian Tobey <info@groundhogg.io>
 * @copyright   Copyright (c) 2018, Groundhogg Inc.
 * @license     https://opensource.org/licenses/GPL-3.0 GNU Public License v3
 * @since       File available since Release 0.9
 */
class Apply_Note extends Action {
	/**
	 * @return string
	 */
	public function get_help_article() {
		return 'https://docs.groundhogg.io/docs/builder/actions/apply-note/';
	}

	/**
	 * ] et the element name
	 *
	 * @return string
	 */
	public function get_name() {
		return _x( 'Add Note', 'step_name', 'groundhogg' );
	}

	/**
	 * Get the element type
	 *
	 * @return string
	 */
	public function get_type() {
		return 'apply_note';
	}

	/**
	 * Get the description
	 *
	 * @return string
	 */
	public function get_description() {
		return _x( 'Add a note to the notes section of a contact.', 'step_description', 'groundhogg' );
	}

	/**
	 * Get the icon URL
	 *
	 * @return string
	 */
	public function get_icon() {
		return GROUNDHOGG_ASSETS_URL . '/images/funnel-icons/apply-note.png';
	}

	/**
	 * Save the step settings
	 *
	 * @param $step Step
	 */
	public function save( $step ) {
		$this->save_setting( 'note_title', sanitize_text_field( $this->get_posted_data( 'note_title', "" ) ) );
		$this->save_setting( 'note_text', sanitize_textarea_field( $this->get_posted_data( 'note_text', "" ) ) );
	}

	/**
	 * Process the apply note step...
	 *
	 * @param $contact Contact
	 * @param $event Event
	 *
	 * @return true;
	 */
	public function run( $contact, $event ) {

		$note = $this->get_setting( 'note_text' );

		$finished_note = sanitize_textarea_field( Plugin::$instance->replacements->process( $note, $contact->get_id() ) );

		// Add funnel context
		$contact->add_note( $finished_note, 'funnel', $event->get_funnel_id() );

		return true;

	}
}