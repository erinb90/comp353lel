
$(window).on('load',function() {
      // DO ajax request to the endpoint to find all the appointment
       $.ajax({
                  type: "GET",
                  url: "../endpoints-mock-data/receptionist-appointments.json",
                  dataType:"json",
                  beforeSend: ShowSpinner,
                  success: function (data) {
                        HideSpinner();

                        PopulateAppointmentTables(data);
                  },
                  error: function(err){
                        HideSpinner();
                        alert(err);
                  }
            });
});

// This method will populate the frontend with backend data
function PopulateAppointmentTables(json_data){
      var count = 1;
      $.each(json_data, function(key, element) {
            var row_of_data = '<tr>'+
                                    '<td>'+ count +'</td>'+
                                    '<td>'+ element.doctor +'</td>'+
                                    '<td>'+ element.patient+'</td>'+
                                    '<td>'+ element.center+'</td>'+
                                    '<td>'+ element.date+'</td>'+
                              '</tr>';
            $('#appointments').append(row_of_data);
            count++;
      }, this);
}

function GetAppointments(){
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    if($('#referral-search').val() !=""){
         $.ajax({
        type: "GET",
        url: "../endpoints-mock-data/receptionist-serialnumber-results.json",
        dataType: "json",
        data: $('#referral-search').val(),
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
}

function CloseSchedule(){
    $("#myModal").modal('hide');
}
