(function ($, frame, email) {

    $('#email-form').on('submit', function () {
        $('.spinner').css('visibility', 'visible');

        if (IsFrame.inFrame() && typeof parent.EmailStep != "undefined") {
            parent.EmailStep.changesSaved = true;
            parent.EmailStep.newEmailId = email.email_id;
        }
    });

    $('#update_and_test').on('click', function () {
        var test = $('#test-email');

        var test_email = prompt(email.send_test_prompt, test.val());

        if (test_email) {
            test.attr('name', 'test_email');
            test.val(test_email);
        }
    });

    function operation(table) {

        table.click(function (e) {
            var el = $(e.target);
            if (el.closest('.addmeta').length) {
                el.closest('tr').last().clone().appendTo(el.closest('tr').parent());
                el.closest('tr').parent().children().last().find(':input').val('');
            } else if (el.closest('.deletemeta').length) {
                el.closest('tr').remove();
            }
        });
    }

    var header_table = $("#headers-table");
    operation(header_table);


})(jQuery, IsFrame, Email);