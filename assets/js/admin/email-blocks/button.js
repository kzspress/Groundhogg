wpghEmailEditor = wpghEmailEditor || {};

var wpghButtonBlock;
( function( $, editor ) {

    wpghButtonBlock = {

        blockType: 'button',

        text: null,
        link: null,
        color: null,
        textColor: null,
        font: null,
        size: null,

        init : function () {

            this.text  = $( '#button-text' );
            this.text.on( 'change', function ( e ) {
                editor.getActive().find('a').text($(this).val());
            });

            this.link  = $( '#button-link' );
            this.link.on( 'change', function ( e ) {
                editor.getActive().find('a').attr('href', $(this).val() );
            });

            this.color = $( '#button-color' );
            this.color.wpColorPicker({
                change: function (event, ui) {
                    editor.getActive().find('.email-button').attr('bgcolor', wpghButtonBlock.color.val() );}
            });

            this.textColor = $( '#button-text-color' );
            this.textColor.wpColorPicker({
                change: function (event, ui) {
                    editor.getActive().find('a').css('color', wpghButtonBlock.textColor.val() );}
            });

            this.font = $( '#button-font' );
            this.font.on( 'change', function ( e ) {
                editor.getActive().find('a').css('font-family', $(this).val() );
            });

            this.size = $( '#button-size' );
            this.size.on( 'change', function ( e ) {
                editor.getActive().find('a').css('font-size', $(this).val() + 'px' );
            });

            $(document).on( 'madeActive', function (e, block, blockType ) {

                if ( wpghButtonBlock.blockType === blockType ){

                    // wpghButtonBlock.createEditor();
                    // console.log( {in:'text', blockType: blockType} );
                    wpghButtonBlock.parse( block );
                }

            });

        },

        /**
         * A jquery implement block.
         *
         * @param block $
         */
        parse: function ( block ) {

            this.link.val( block.find('a').attr('href') );
            this.text.val( block.find('a').text() );
            this.font.val( block.find('a').css( 'font-family' ).replace(/"/g, '') );
            this.size.val( block.find('a').css( 'font-size' ).replace('px', '') );

        }

    };

    $(function(){
        wpghButtonBlock.init();
    })

})( jQuery, wpghEmailEditor );