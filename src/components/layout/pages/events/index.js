/**
 * External dependencies
 */
import {Component, Fragment, useState} from '@wordpress/element';
import {compose} from '@wordpress/compose';
import {withSelect, withDispatch, useDispatch, useSelect} from '@wordpress/data';
import {__} from '@wordpress/i18n';
import Button from '@material-ui/core/Button';
import {castArray} from 'lodash';
import Spinner from '../../../core-ui/spinner';

/**
 * Internal dependencies
 */
import {EVENTS_STORE_NAME} from '../../../../data';

export const Events = (props) => {
    // {}
    const [view, setView] = useState('');

    const {runAgain, uncancelEvent, cancelEvent, } = useDispatch(EVENTS_STORE_NAME); // call these methods to handle event // cancelEvent( { events : [] });

    const {events, isRequesting, isUpdating, getEvents } = useSelect((select) => {
        const store = select(EVENTS_STORE_NAME);
        return {
            events: castArray(store.getEvents().events),
            isRequesting: store.isEventsRequesting(), // used for get request
            isUpdating: store.isEventsUpdating(), // used for any other operation
            getEvents : store.getEvents
        }
    });

    if (isRequesting || isUpdating) {
        return <Spinner/>;
    }

    function LoadEvents(event) {
        console.log(event.target.value);
        getEvents(event.target.value);

    }

    return (
        <Fragment>
            <h2>Events</h2>

            <input type="button" value={'waiting'}   onClick={LoadEvents}  />
            <input type="button" value={'cancelled'} onClick={LoadEvents}  />
            <input type="button" value={'complete'}  onClick={LoadEvents} />
            <input type="button" value={'failed'}    onClick={LoadEvents} />
            <input type="button" value={'skipped'}   onClick={LoadEvents} />

            <table>
                <th>
                    <td>
                        ID
                    </td>
                    <td>
                        Email
                    </td>
                    <td>
                        Funnel Title
                    </td>
                    <td>
                        step Title
                    </td>
                    <td>
                        Status
                    </td>
                    <td>
                        ACTION
                    </td>
                </th>
                {
                    events.map((event) => {
                        return (
                            <tr>
                                <td>
                                    {event.ID}
                                </td><td>
                                    {event.contact_email}
                                </td>
                                <td>
                                    {event.funnel_title}
                                </td>
                                <td>
                                    {event.step_title}
                                </td>
                                <td>
                                    {event.status}
                                </td>
                                <td>
                                    {event.status === 'cancelled' ?    <input type="button" data-event_id={event.ID} data-status={event.status} value={'uncancel '} onClick={(event ) => { cancelEvent( { events : [event.target.dataset.event_id] }); /*this.onUnCancelEvent*/ } } />  /*  */  : ''}
                                    {event.status === 'waiting' ?      <input type="button" data-event_id={event.ID} data-status={event.status} value={'cancel   '} onClick={(event ) => {   cancelEvent( { events : [event.target.dataset.event_id] }); /*this.onCancelEvent  */ } } />  /*  */  : ''}
                                    {event.status === 'complete' ?     <input type="button" data-event_id={event.ID} data-status={event.status} value={'run again'} onClick={(event ) => {  runAgain( { events : [event.target.dataset.event_id] }); /*this.onRunAgain     */ } } />  /*  */  : ''}
                                    {event.status === 'failed' ?       <input type="button" data-event_id={event.ID} data-status={event.status} value={'run again'} onClick={(event ) => {  runAgain( { events : [event.target.dataset.event_id] }); /*this.onRunAgain     */ } } />  /*  */  : ''}
                                    {event.status === 'skipped' ?      <input type="button" data-event_id={event.ID} data-status={event.status} value={'run again'} onClick={(event ) => {  runAgain( { events : [event.target.dataset.event_id] }); /*this.onRunAgain     */ } } /> /* '*/  : ''}
                                </td>
                            </tr>
                        )
                    })
                }
            </table>
        </Fragment>
    );
};

