$(window).on('load', function () {
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    $.ajax({
        type: "POST",
        url: "../services/getAppointments.php",
        dataType: "json",
        beforeSend: ShowSpinner,
        success: function (data) {
            HideSpinner();
            PopulateAppointmentTables(data);
        },
        error: function (err) {
            HideSpinner();
            alert(err);
        }
    });
});


// This method will populate the frontend with backend data
function PopulateAppointmentTables(json_data) {
    var count = 1;
    json_data = json_data['results'];
   $.each(json_data, function(key, element)  {
        var row_of_data = '<tr>' +
            '<td>' + count + '</td>' +
            '<td>' + element.p_firstname + " " + element.p_lastname + '</td>' +
            '<td><a href="#" class="btn btn-primary" onclick="LoadPatientInfo(' + '\'' + element.phn + '\'' + ');">info</a></td>' +
            '<td>' + "Bahamas" + '</td>' +
            '<td>' + element.date + '</td>' +
            '</tr>';
        $('#physicianappointments').append(row_of_data);
        count++;
    });
}

//this method is to load patient record from backend into a modal and allow modification
function LoadPatientInfo(phn) {
    $("#myModal").modal();
    var data;
    //TODO request patient info by phn from the back end
    //GetPatient(phn)
    //response {"firtname" : "another", "lastname": "guy", "age":"233", "sex":"female"}
    $.ajax({
    type: "GET",
    url: "../services/find_patient.php",
    dataType: "json",
    contentType: "application/json",
    data: {'phn-search': phn},
    beforeSend: ShowSpinner,
    success: function (res) {
     console.log(res);
         HideSpinner();
         PopulateInfo(res);
    },
    error: function (err) {
       HideSpinner();
       alert(err);
    }
    });
  $("#phn").val(phn);
}
function PopulateInfo(data){
  $.each(data, function (key, val) {
      $("#" + key).val(val);
  })

}
