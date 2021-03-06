function ShowSpinner() {
    // spinner is in "navbar" template
    $('#spinner').css('display', 'block');
}

function HideSpinner() {
    // spinner is in "navbar" template
    $('#spinner').css('display', 'none');
}

function SendRequestAjax(end_point, method, dat, success_callback, popup) {
    $.ajax({
        type: method,
        url: end_point,
        dataType: "json",
        data: dat,
        beforeSend: ShowSpinner,
        success: function (data) {
            HideSpinner();
            success_callback(data);
            popup(data);
            //TODO add function to handle the reults of the request like a success popup
        },
        error: function (err) {
            HideSpinner();
            popup(err);

        }
    });
}

function ShowResultModal(data){
    $("#msg").html(data.msg);
    $('#status').html(data.status);
    $("#result_modal").modal();
}

$('#user-name').ready(function() {
    $.ajax({
        type: "GET",
        url: "../services/getusername.php",
        dataType: "text",
        cache: "false",
        success: function (data) {
            if(data == "error"){
                window.location = '../pages/Login.html';
            }
            $('#user-name').html(data);
        }
    });
});