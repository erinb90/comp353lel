$(window).on('load', function () {
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    $.ajax({
        type: "POST",
        url: "../services/getPatientAppointments.php",
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
            '<td>' + element.staff_firstname + " " + element.staff_lastname + '</td>' +
            '<td>' + element.time + '</td>' +
            '<td>' + element.date + '</td>' +
            '</tr>';
        $('#patientappointments').append(row_of_data);
        count++;
    });
}

function MakeAppointments() {
    // DO ajax request to the endpoint to find all the appointment once the page is loaded
    if ($('#referral-search').val() != "") {
        $.ajax({
            type: "POST",
            url: "../services/getReferralInfo.php",
            dataType: "json",
            data: {serialno: $('#referral-search').val()},
            beforeSend: ShowSpinner,
            success: function (data) {
                if (data.response) {
                    HideSpinner();
                    referral_info = data.results;

                    // Make ajax request to get all appointments
                    $.ajax({
                        type: "POST",
                        url: "../services/getAppointments.php",
                        dataType: "json",
                        method: 'POST',
                        beforeSend: ShowSpinner,
                        success: function (data) {

                            HideSpinner();
                            if (data.response) {

                                var reserved_slots = {};
                                var valid_referral = true;

                                $.each(data.results, function (idx, record) {

                                    // Check that referral does not already has an appointment
                                    if (referral_info.serial_no === record.serialno) {
                                        ShowResultModal({
                                            'status': "Failed",
                                            'msg': "Referral is already linked to an appointment."
                                        });

                                        valid_referral = false;
                                        return false;
                                    }

                                    else {
                                        // Use the date and time as key for the schedule
                                        if (moment(record.date) >= moment()) {
                                            var reserved_key = moment(record.date + " " + record.time).format("D-M-H");
                                            reserved_slots[reserved_key] = "filled";
                                        }
                                    }
                                });

                                if (valid_referral) {
                                    $("#myModal").modal();

                                    var scheduled_data = {
                                        phn: referral_info.patient_phn,
                                        licence_number: referral_info.staff_license_no,
                                        serialnumber: referral_info.serial_no,
                                        reserved_slots: reserved_slots
                                    };
                                    CreateSchedule(scheduled_data);
                                }

                                // Check that referral is valid

                            }

                            //TODO this else is nott working WEIRDDD
                            else {
                                ShowResultModal({'status': 'Failed', 'msg': "You can't send empty request"});
                            }
                        },
                        error: function (err) {
                            HideSpinner();
                            alert(err);
                        }
                    });
                }
            }
        });
    }
    else{
         ShowResultModal({
             'status': 'Failed',
             'msg': "You can't send empty request"});
    }
}



function CloseSchedule() {
    $("#myModal").modal('hide');
}
