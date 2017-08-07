function GetAppointments(){
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    if($('#referral-search option:selected').val() !=""){
         $.ajax({
        type: "GET",
        url: "../endpoints-mock-data/receptionist-serialnumber-results.json",
        dataType: "json",
        data: $('#referral-search option:selected').val(),
        beforeSend: ShowSpinner,
        success: function (data) {
            HideSpinner();
            $("#myModal").modal();
            CreateSchedule(data);
        },
        error: function (err) {
            HideSpinner();
            alert(err);
        }
    });
    }
}/**
 * Created by BABO99 on 2017-08-02.
 */

function CloseSchedule(){
    $("#myModal").modal('hide');
}