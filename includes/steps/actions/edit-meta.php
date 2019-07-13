<?php
namespace Groundhogg\Steps\Actions;

use Groundhogg\Contact;
use Groundhogg\Event;
use Groundhogg\Plugin;
use Groundhogg\Step;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Edit Meta
 *
 * This allows the user to add information to a contact depeding on where they are in their customer journey. Potentially using them as merge fields later on.
 *
 * @package     Elements
 * @subpackage  Elements/Actions
 * @author      Adrian Tobey <info@groundhogg.io>
 * @copyright   Copyright (c) 2018, Groundhogg Inc.
 * @license     https://opensource.org/licenses/GPL-3.0 GNU Public License v3
 * @since       File available since Release 0.9
 */
class Edit_Meta extends Action
{
    /**
     * @return string
     */
    public function get_help_article()
    {
        return 'https://docs.groundhogg.io/docs/builder/actions/edit-meta/';
    }

    /**
     * Get the element name
     *
     * @return string
     */
    public function get_name()
    {
        return _x( 'Edit Meta', 'step_name', 'groundhogg' );
    }

    /**
     * Get the element type
     *
     * @return string
     */
    public function get_type()
    {
        return 'edit_meta';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function get_description()
    {
        return _x( 'Directly edit the meta data of the contact.', 'step_description', 'groundhogg' );
    }

    /**
     * Get the icon URL
     *
     * @return string
     */
    public function get_icon()
    {
        return GROUNDHOGG_ASSETS_URL . '/images/funnel-icons/edit-meta.png';
    }

    /**
     * Display the settings
     *
     * @param $step Step
     */
    public function settings( $step )
    {
        $post_keys      = $step->get_meta( 'meta_keys' );
        $post_values    = $step->get_meta( 'meta_values' );

        if ( ! is_array( $post_keys ) || ! is_array( $post_values ) ){
            $post_keys = array( '' ); //empty to show first option.
            $post_values = array( '' ); //empty to show first option.
        }

        $html = Plugin::$instance->utils->html;

	    $rows = [];

	    foreach ( $post_keys as $i => $post_key ):

		    $rows[] = [
			    $html->input( [
				    'name'  => $this->setting_name_prefix( 'meta_keys' ) . '[]',
				    'class' => 'input',
				    'value' => sanitize_key( $post_key )
			    ] ),
			    $html->input( [
				    'name'  => $this->setting_name_prefix( 'meta_values' ) . '[]',
				    'class' => 'input',
				    'value' => esc_html( $post_values[$i] )
			    ] ),
			    "<span class=\"row-actions\">
                        <span class=\"add\"><a style=\"text-decoration: none\" href=\"javascript:void(0)\" class=\"addmeta\"><span class=\"dashicons dashicons-plus\"></span></a></span> |
                        <span class=\"delete\"><a style=\"text-decoration: none\" href=\"javascript:void(0)\" class=\"deletemeta\"><span class=\"dashicons dashicons-trash\"></span></a></span>
                    </span>"
		    ];


	    endforeach;

	    $html->list_table( [ 'id' => 'meta-table-' . $step->get_id()  ], [ __( 'Key' ), __( 'Value' ), __( 'Actions' ) ], $rows, false );
	    
	    ?>
        <script>
            jQuery(function($){
                var table = $( "#meta-table-<?php echo $step->ID; ?>" );
                table.click(function ( e ){
                    var el = $(e.target);
                    if ( el.closest( '.addmeta' ).length ) {
                        el.closest('tr').last().clone().appendTo( el.closest('tr').parent() );
                        el.closest('tr').parent().children().last().find( ':input' ).val( '' );
                    } else if ( el.closest( '.deletemeta' ).length ) {
                        el.closest( 'tr' ).remove();
                    }
                });
            });
        </script>
	    <?php
    }

    /**
     * Save the settings
     *
     * @param $step Step
     */
    public function save( $step )
    {

        $post_keys = $this->get_posted_data( 'meta_keys', [] );

        if ( $post_keys ){
            $post_values = $this->get_posted_data( 'meta_values', [] );

            if ( ! is_array( $post_keys ) )
                return;

            $post_keys = array_map( 'sanitize_key', $post_keys );
            $post_values = array_map( 'sanitize_text_field', wp_unslash( $post_values ) );

            $this->save_setting( 'meta_keys', $post_keys );
            $this->save_setting( 'meta_values', $post_values );
        }

    }


    /**
     * Process the http post step...
     *
     * @param $contact Contact
     * @param $event Event
     *
     * @return bool|object
     */
    public function run( $contact, $event )
    {

        $meta_keys = $this->get_setting(  'meta_keys', [] );
        $meta_values = $this->get_setting( 'meta_values', [] );

        if ( ! is_array( $meta_keys ) || ! is_array( $meta_values ) || empty( $meta_keys ) || empty( $meta_values ) ){
            return false;
        }

        foreach ( $meta_keys as $i => $meta_key ){
            $contact->update_meta( sanitize_key( $meta_key ), sanitize_text_field( Plugin::$instance->replacements->process( $meta_values[ $i ], $contact->get_id() ) ) );
        }

        return true;

    }
}