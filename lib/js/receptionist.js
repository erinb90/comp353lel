$(window).on('load', function () {
    // DO ajax request to the endpoint to find all the appointment
    GetSchedule(0);
    $('data-range').ready(AddWeekButtons)

});


function AddWeekButtons() {
    for (i = 0; i < 8; ++i) {
        var active = "";
        if (i === 0) {
            active = "active"
        }

        var str = '<a class="btn btn-default btn-sm" onclick="GetSchedule(\'' + i + '\')">Week ' + GetDayMonthNames(i, 0) + '</a>';
        $("#date-range").append(str);
    }
}


// This method will populate the frontend with backend data
function PopulateAppointmentTables(json_data) {

    $("#appointments").empty();

    $.each(json_data, function (key, element) {
        var row_of_data = '<tr>' +
            '<td>' + element.phn + '</td>' +
            '<td>' + element.p_firstname + " " + element.p_lastname + '</td>' +
            '<td>' + element.licenseno + '</td>' +
            '<td>' + element.staff_firstname + " " + element.staff_lastname + '</td>' +
            '<td>' + element.date + '</td>' +
            '<td>' + element.time + '</td>' +
            '</tr>';
        $('#appointments').append(row_of_data);
    }, this);

}


function GetSchedule(week_number) {
    var data = {
        'start_date': moment().day(1 + (parseInt(week_number) * 7)).format("YYYY-MM-DD"),
        'end_date': moment().day(1 + ((parseInt(week_number) + 1) * 7)).format("YYYY-MM-DD")
    };
    $.ajax({
        type: "POST",
        url: "../services/getAppointments.php",
        dataType: "json",
        beforeSend: ShowSpinner,
        data: data,
        success: function (data) {
            HideSpinner();
            PopulateAppointmentTables(data.results);
        },
        error: function (err) {
            HideSpinner();
            alert(err);
        }
    });
}

function GetAppointments() {

    if ($('#referral-search').val() != "") {

        // Get the referral info first
        getReferralInfo(function (referral_info) {

            // Check if info is correct
            if (referral_info === false) {
                alert("Error fetching referral info.");
                return;
            }

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
                                alert("Referral is already linked to an appointment.");
                                valid_referral = false;
                                return false;
                            } else {
                                // Use the date and time as key for the schedule
                                if (moment(record.date) >= moment()) {
                                    var reserved_key = moment(record.date + " " + record.time).format("D-M-H");
                                    reserved_slots[reserved_key] = "filled";
                                }
                            }

                        });

                        // Check that referral is valid and that there is at least a reserved slot
                        if (valid_referral && !$.isEmptyObject(reserved_slots)) {

                            $("#myModal").modal();

                            var scheduled_data = {
                                phn: referral_info.patient_phn,
                                licence_number: referral_info.staff_license_no,
                                serialnumber: referral_info.serial_no,
                                reserved_slots: reserved_slots
                            };
                            CreateSchedule(scheduled_data);

                        } else if($.isEmptyObject(reserved_slots)) {
                            alert("No reserved slots could be found.");
                        }
                    }
                },
                error: function (err) {
                    HideSpinner();
                    alert(err);
                }
            });

        });

    } else {
        alert("No Referral Serial No");
    }
}

function getReferralInfo(callback) {

    // Ajax to get only referral info
    $.ajax({
        type: 'POST',
        url: '../services/getReferralInfo.php',
        dataType: 'json',
        data: {
            serialno: $('#referral-search').val()
        },
        beforeSend: ShowSpinner,
        success: function (data) {
            if (data.response) {
                callback(data.results);
            } else {
                HideSpinner();
                callback(false);
            }
        },
        error: function (data) {
            HideSpinner();
            callback(false);
        }
    });

}

function CloseSchedule() {
    $("#myModal").modal('hide');
}
