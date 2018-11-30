var GH;

(function ($) {
    GH = {
        leadSource: 'gh_referer',
        refID: 'gh_ref_id',
        setCookie: function(cname, cvalue, exdays){
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        getCookie: function( cname ){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return null;
        },
        pageView : function(){
            $.ajax({
                type: "post",
                url: wpgh_ajax_object.ajax_url,
                data: {action: 'wpgh_page_view'},
                success: function( response ){
                    // console.log( events_complete )
                }
            });
        },
        logFormImpressions : function() {
            var forms = $( '.gh-form' );
            $.each( forms, function ( i, e ) {
                var fId = $(e).find( 'input[name="step_id"]' ).val();
                GH.formImpression( fId );
            });
        },
        formImpression : function( id ){
            $.ajax({
                type: "post",
                url: wpgh_ajax_object.ajax_url,
                dataType: 'json',
                data: {action: 'wpgh_form_impression', id: id},
                success: function( response ){
                    if ( typeof response.error !== 'undefined' ){
                        console.log( response.error );
                    } else if( typeof response.ref_id !== 'undefined' ) {
                        GH.setCookie( GH.refID, response.ref_id, 30 );
                    }
                }
            });
        },
        setQueueTimer:function()
        {
            GH.processQueue();
            setInterval(GH.processQueue, 30000);
        },
        processQueue: function(){
            $.ajax({
                type: "post",
                url: wpgh_ajax_object.ajax_url,
                data: {action: 'gh_process_queue' }
            });
        },
        init: function(){
            var referer = this.getCookie( this.leadSource );
            if ( ! referer ){
                this.setCookie( this.leadSource, document.referrer, 3 )
            }
            this.pageView();
            this.logFormImpressions();
            this.setQueueTimer();
        }
    };

    $(function(){
        GH.init();
    });
})(jQuery);
