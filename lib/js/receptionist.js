$(window).on('load',function() {
      // DO ajax request to the endpoint to find all the appointment
    GetSchedule(0);
    $('data-range').ready(AddWeekButtons)

});


function AddWeekButtons(){
     for(i=0; i<8; ++i){
        var active ="";
        if (i===0){
            active = "active"
        }

        var str = '<a class="btn btn-default btn-sm" onclick="GetSchedule(\''+i+'\')">Week '+GetDayMonthNames(i,0)+'</a>';
        $("#date-range").append(str);
    }
}


// This method will populate the frontend with backend data
function PopulateAppointmentTables(json_data){
      $("#appointments").empty();

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


function GetSchedule(week_number){
    moment().format("YYYY-MM-DD");
    dat = {
        'start_date' :  moment().day(1+(parseInt(week_number)*7)).format("YYYY-MM-DD"),
        'end_date'   :  moment().day(1+((parseInt(week_number)+1)*7)).format("YYYY-MM-DD"),
    }
   $.ajax({
                  type: "GET",
                  url: "../endpoints-mock-data/receptionist-appointments.json",
                  dataType:"json",
                  beforeSend: ShowSpinner,
                  data: dat,
                  success: function (data) {
                        HideSpinner();

                        PopulateAppointmentTables(data);
                  },
                  error: function(err){
                        HideSpinner();
                        alert(err);
                  }
            });
}

function GetAppointments(){
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    if($('#referral-search').val() !=""){
         $.ajax({
        type: "GET",
        url: "../services/getAppointments.php,
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

function CloseSchedule() {
    $("#myModal").modal('hide');
}
