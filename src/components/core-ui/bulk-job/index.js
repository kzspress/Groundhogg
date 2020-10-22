import {Fragment, useState} from "@wordpress/element";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import {NAMESPACE} from "data/constants";
import apiFetch from '@wordpress/api-fetch';
import {receiveBroadcasts, setIsRequestingBroadcasts, setRequestingError} from "data/broadcasts/actions";

const BulkJob = (props) => {

    const {
        jobId,
        perRequest = Math.max(perRequest, 10),
        title,
        context,
        onClose,
        action
    } = props;
    const [properties, setProperties] = useState({
        progress: 0,
        offset: 0,
        total: 0,
        nextRequest: true,
        message: ''
    });

    const {offset, progress, total, nextRequest ,message} = properties;

    if (nextRequest === false) {
        onClose(true);
    }


    // make HTTP request to perform the task
    function scheduleJob() {
        let data = {
            items_per_request: perRequest,
            items_offset: offset,
            job_id: jobId,
            context: context
        };
        try {
            const url = NAMESPACE + '/bulkjob/' + action;
            apiFetch({
                method: 'POST',
                path: url,
                data: data
            }).then(({next_index, total_records, next_request, message}) => {
                setProperties({
                    offset: next_index,
                    total: total_records,
                    nextRequest: next_request,
                    message:message,
                    progress: Math.round((next_index * 100) /total_records )
                });
            });


        } catch (error) {
            // yield setRequestingError(error);
        }
    }

    scheduleJob();
    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            // maxWidth="xs"
            // onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={true}
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent dividers>
                <LinearProgress variant="determinate" value={progress}/>
                {progress + "%" +  '(' + offset +'/'+ total + ')'}
                <br/>
                {message}
            </DialogContent>
        </Dialog>

    );
}
export default BulkJob;