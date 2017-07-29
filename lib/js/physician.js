$(window).on('load', function () {
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    $.ajax({
        type: "GET",
        url: "../endpoints-mock-data/physician-appointments.json",
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

   $.each(json_data, function(key, element)  {
        var row_of_data = '<tr>' +
            '<td>' + count + '</td>' +
            '<td>' + element.patient + '</td>' +
            '<td><a href="#" class="btn btn-primary" onclick="LoadPatientInfo(' + '\'' + element.phn + '\'' + ');">info</a></td>' +
            '<td>' + element.center + '</td>' +
            '<td>' + element.date + '</td>' +
            '</tr>';
        $('#physicianappointments').append(row_of_data);
        count++;
    });
}

//this method is to load patient record from backend into a modal and allow modification
function LoadPatientInfo(phn) {
    $("#myModal").modal();

    //TODO request patient info by phn from the back end
    //response {"name":"jon snow", "age":"233", "phonenumber":"5149887987", "sex":"male", "city":"mtl", "postalcode":"h3k233"}

    var data = {
        "name": "jon snow",
        "age": "233",
        "phonenumber": "5149887987",
        "sex": "female",
        "city": "mtl",
        "postalcode": "h3k233",
        "email": "dhdas@veken.com"
    }
    $.each(data, function (key, val) {
        $("#" + key).val(val);
    })
    $("#phn").val(phn);
}
