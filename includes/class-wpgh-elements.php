<?php
/**
 * Elements
 *
 * This exists solely to init the basic steps. Do not look here for adding you own steps. Extending the WPGH_Funnel_Step class is enough.
 *
 * @package     Includes
 * @author      Adrian Tobey <info@groundhogg.io>
 * @copyright   Copyright (c) 2018, Groundhogg Inc.
 * @license     https://opensource.org/licenses/GPL-3.0 GNU Public License v3
 * @since       File available since Release 0.1
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class WPGH_Elements
{

    /**
     * Storage for the instances of the steps
     *
     * @var array
     */
    private $elements = array();


    function __construct()
    {
        $this->includes();

        /* actions */
        $this->elements[] = new WPGH_Send_Email();
        $this->elements[] = new WPGH_Send_SMS();
        $this->elements[] = new WPGH_Admin_Notification();
        $this->elements[] = new WPGH_Apply_Note();
        $this->elements[] = new WPGH_Apply_Tag();
        $this->elements[] = new WPGH_Remove_Tag();
        $this->elements[] = new WPGH_Date_Timer();
        $this->elements[] = new WPGH_Field_Timer();
        $this->elements[] = new WPGH_Delay_Timer();
        $this->elements[] = new WPGH_Apply_Owner();
        $this->elements[] = new WPGH_Create_User();
        $this->elements[] = new WPGH_Edit_Meta();
        $this->elements[] = new WPGH_HTTP_Post();

        /* Benchmarks */
        $this->elements[] = new WPGH_Account_Created();
	    $this->elements[] = new WPGH_Role_Changed();
	    $this->elements[] = new WPGH_Login_Status_Changed();
        $this->elements[] = new WPGH_Form_Filled();
        $this->elements[] = new WPGH_Tag_Applied();
        $this->elements[] = new WPGH_Tag_Removed();
        $this->elements[] = new WPGH_Page_Visited();
        $this->elements[] = new WPGH_Link_Clicked();
        $this->elements[] = new WPGH_Email_Confirmed();

    }

    /**
     * Include all the steps for the Funnel Steps
     */
    private function includes()
    {
        /* Parent Class */
        include_once dirname(__FILE__) . '/steps/funnel-step.php';

        /* actions */
        $action_path = dirname( __FILE__ ) . '/steps/actions/';

        include_once $action_path . 'admin-notification.php';
        include_once $action_path . 'apply-note.php';
        include_once $action_path . 'apply-owner.php';
        include_once $action_path . 'apply-tag.php';
        include_once $action_path . 'create-user.php';
        include_once $action_path . 'date-timer.php';
        include_once $action_path . 'field-timer.php';
        include_once $action_path . 'delay-timer.php';
        include_once $action_path . 'edit-meta.php';
        include_once $action_path . 'http-post.php';
        include_once $action_path . 'remove-tag.php';
        include_once $action_path . 'send-email.php';
        include_once $action_path . 'send-sms.php';

        /* Benchmarks */
        $benchmark_path = dirname( __FILE__ ) . '/steps/benchmarks/';

        include_once $benchmark_path . 'class-wpgh-account-created.php';
        include_once $benchmark_path . 'class-wpgh-email-confirmed.php';
        include_once $benchmark_path . 'class-wpgh-login-status.php';
        include_once $benchmark_path . 'class-wpgh-form-filled.php';
        include_once $benchmark_path . 'class-wpgh-link-clicked.php';
        include_once $benchmark_path . 'class-wpgh-page-visited.php';
        include_once $benchmark_path . 'class-wpgh-role-changed.php';
        include_once $benchmark_path . 'class-wpgh-tag-applied.php';
        include_once $benchmark_path . 'class-wpgh-tag-removed.php';

    }

    /**
     * Return an array of benchmarks
     *
     * @return
     */
    public function get_benchmarks()
    {
        return apply_filters( "groundhogg/steps/benchmarks", array() );
    }

    /**
     * Return an array of actions
     *
     * @return array
     */
    public function get_actions()
    {
        return apply_filters( 'groundhogg/steps/actions', array() );
    }

    /**
     * Get an array of ALL benchmarks and actions
     *
     * @return array
     */
    public function get_elements()
    {

        return array_merge( $this->get_actions(), $this->get_benchmarks() );

    }



}