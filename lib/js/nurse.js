// this will hold current user data
var user = {}

$(window).on('load', function () {
    HideSpinner();
});

function GetUser() {
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    if($('#phn-search').val() !=""){
         $.ajax({
        type: "GET",
        url: "../services/find_patient.php",
        dataType: "json",
        contentType: "application/json",
        data: {'phn-search': $('#phn-search').val()},
        beforeSend: ShowSpinner,
        success: function (data) {
          console.log(data);
              HideSpinner();
          if(data.status){

            PopulatePatientInfo(data);
          }
          else{
            ShowResultModal(data);
          }
        },
        error: function (err) {
            HideSpinner();
            alert(err);
        }
    });
    }
}


// This method will populate the frontend with backend data
function PopulatePatientInfo(json_data) {
    $("tr").remove();

    user = json_data;
    var count = 1;
        var row_of_data = '<tr>' +
            '<td>' + count + '</td>' +
            '<td>' + json_data.firstname +" "+ json_data.lastname + '</td>' +
            '<td><a href="#" class="btn btn-primary" onclick="LoadPatientInfo(' + '\'' + json_data.phn + '\'' + ');">info</a></td>' +
            '</tr>';
        $('#user-found').append(row_of_data);
}

//this method is to load patient record from backend into a modal and allow modification
function LoadPatientInfo(phn) {
    $("#myModal").modal();

    //TODO request patient info by phn from the back end
    //response {"name":"jon snow", "age":"233", "phonenumber":"5149887987", "sex":"male", "city":"mtl", "postalcode":"h3k233"}


    $.each(user, function (key, val) {
        $("#" + key).val(val);
    })
    $("#phn").val(phn);
}
