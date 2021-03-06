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

    if ($('#referral-search option:selected').val() != "") {

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
                data: {
                    license_no: referral_info.staff_license_no
                },
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

                        // Check that referral is valid
                        $("#myModal").modal();

                        var scheduled_data = {
                            phn: referral_info.patient_phn,
                            licence_number: referral_info.staff_license_no,
                            serialnumber: referral_info.serial_no,
                            reserved_slots: reserved_slots
                        };
                        CreateSchedule(scheduled_data);

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
            serialno: $('#referral-search option:selected').val()
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

function getInfoCreateRef() {

    // Clear form
    $("#referral-form")[0].reset();

    $.ajax({
        type: 'POST',
        url: '../services/getPatientStaffInfo.php',
        dataType: 'json',
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response) {
                populateReferralForm(data.results);
            } else {
                HideSpinner();
                ShowResultModal(data);
            }
        },
        error: function (data) {
            alert(data);
        }
    });

}

function populateReferralForm(referral_data) {

    var referral_phn = $("#referral-phn");
    referral_phn.empty();
    referral_phn.append("<option value='' selected disabled></option>");

    // Populate patient info
    $.each(referral_data.patient_results, function (idx, record) {
        referral_phn.append("<option value='" + record.phn + "'>" + record.phn + " - " + record.f_name + " " + record.l_name + "</option>")
    });

    var referral_licenceno = $("#referral-licencenumber");
    referral_licenceno.empty();
    referral_licenceno.append("<option value='' selected disabled></option>");

    // Populate staff info
    $.each(referral_data.staff_info, function (idx, record) {
        referral_licenceno.append("<option value='" + record.licenseno + "'>" + record.licenseno + " - " + record.f_name + " " + record.l_name + "</option>")
    });

}

function getAllLicenseSerialNo(reload) {

    var referral_search = $("#referral-search");
    referral_search.empty();
    referral_search.append("<option value='' selected disabled></option>");

    referral_search.val($("#referral-search option:first").val());

    $.ajax({
        type: 'POST',
        url: '../services/getLicenseNoAppt.php',
        dataType: 'json',
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response) {
                if (data.results.length > 0) {
                    populateMakeAppointment(data.results);
                } else if (!reload) {
                    ShowResultModal({
                        "msg": "No referral could be found to make an appointment. <br> Create an appointment is necessary",
                        "status": "No referral found"
                    });
                }
            } else {
                ShowResultModal(data);
            }
        },
        error: function (data) {
            alert(data);
        }
    });

}


function populateMakeAppointment(data) {

    // Populate staff info
    $.each(data, function (idx, record) {
        $("#referral-search").append("<option value='" + record[0] + "'>" + record[0] + "</option>")
    });

}


function resetPatientForm() {
    $("#register-form")[0].reset();
}

function CloseSchedule() {
    $("#myModal").modal('hide');
}


function GetStuffList() {
    $.ajax({
        type: "GET",
        url: "../services/getStaffDetails.php",
        dataType: "json",
        contentType: "application/json",
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response) {
                PopulateStuffInfo(data.results);
            } else {
                ShowResultModal(data);
            }
        },
        error: function (err) {
            alert(err);
        }
    });
}

function PopulateStuffInfo(data) {
    $('#stuff-list').empty();

    var count = 1;

    $.each(data, function (key, element) {
        var row_of_data = '<tr>' +
            '<td>' + count + '</td>' +
            '<td>' + element.license_no + '</td>' +
            '<td>' + element.first_name + " " + element.last_name + '</td>' +
            '<td>' + element.staff_title + '</td>' +
            '<td><a href="#" class="btn btn-primary" onclick="LoadStuffInfo(' + '\'' + element.license_no + '\'' + ');">info</a></td>' +
            '</tr>';
        $('#stuff-list').append(row_of_data);
        count++;
    });
}

function LoadStuffInfo(stuff_id) {
    $("#stuffinfo").modal();

    $.ajax({
        url: '../services/getStaffDetails.php',
        method: 'POST',
        dataType: 'json',
        data: {
            staff_license_no: stuff_id
        },
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response) {

                $("#s_firstname").val(data.results[0]["first_name"]);
                $("#s_lastname").val(data.results[0]["last_name"]);
                $("#s_id").val(stuff_id);

            } else {
                ShowResultModal(data);
            }
        },
        error: function (err) {
            alert(err);
        }
    });

}


// when the button is clicked in modify appointments
function GetALLPatientAppointments() {

    var data = {
        "patient_phn": $("#appm_phn").val(),
        "license_no": $("#appm_licence").val()
    };

    $.ajax({
        type: "POST",
        url: "../services/getAppointments.php",
        dataType: "json",
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        data: data,
        success: function (data) {
            PopulateModifyAppointments(data);
        },
        error: function (err) {
            alert(err);
        }
    });

}

function PopulateModifyAppointments(data) {

    if (!data.response && data.results === null){
        ShowResultModal({status: "Empty List", "msg" : "No appointments were found based on this info"});
        return;
    }else if (!data.response){
        ShowResultModal({status: "Error", "msg" : "Failed to fetch record"});
        return;
    }

    var json_data = data.results;
    $("#appontment-modify-list").empty();

    $.each(json_data, function (key, element) {
        var row_of_data = '<tr>' +
            '<td>' + element.date + '</td>' +
            '<td>' + element.time + '</td>' +
            '<td><a href="#" class="btn btn-primary" onclick="PrepareModifyScheduleData(' + '\'' + element.appt_id + '\',' +
            '\'' + element.phn + '\',' +
            '\'' + element.licenseno + '\',' +
            '\'' + element.serialno + '\'' + ');">Modify</a></td>' +
            '</tr>';
        $('#appontment-modify-list').append(row_of_data);
    });
}


function PrepareModifyScheduleData(app_id, phn, licenece_number, serial_no) {

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "../services/getAppointments.php",
        data: {
            license_no: licenece_number
        },
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {

            var reserved_slots = {};

            $.each(data.results, function (idx, record) {

                // Use the date and time as key for the schedule
                if (moment(record.date) >= moment()) {
                    var reserved_key = moment(record.date + " " + record.time).format("D-M-H");
                    reserved_slots[reserved_key] = "filled";
                }

            });

            $("#myModal").modal();

            var scheduled_data = {
                other: {app_id: app_id},
                phn: phn,
                licence_number: licenece_number,
                serialnumber: serial_no,
                reserved_slots: reserved_slots
            };
            CreateSchedule(scheduled_data);

        },
        error: function (data) {
            alert(data);
        }
    });

}

function getPatientStaffList() {

    $("#appontment-modify-list").empty();

    $.ajax({
        type: 'GET',
        url: '../services/getPatientStaffInfo.php',
        dataType: 'json',
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {

            if (data.response){
                populateEditApptForm(data.results);
            }else{
                ShowResultModal(data);
            }

        },
        error: function (err) {
            alert(err);
        }
    });

}

function populateEditApptForm(referral_data) {

    var appt_phn = $("#appm_phn");
    appt_phn.empty();
    appt_phn.append("<option value='' selected disabled></option>");

    // Populate patient info
    $.each(referral_data.patient_results, function (idx, record) {
        appt_phn.append("<option value='" + record.phn + "'>" + record.phn + " - " + record.f_name + " " + record.l_name + "</option>")
    });

    var appt_licenceno = $("#appm_licence");
    appt_licenceno.empty();
    appt_licenceno.append("<option value='' selected disabled></option>");

    // Populate staff info
    $.each(referral_data.staff_info, function (idx, record) {
        appt_licenceno.append("<option value='" + record.licenseno + "'>" + record.licenseno + " - " + record.f_name + " " + record.l_name + "</option>")
    });

}
function populateAllPatients(data){
    var allPat =  $('#all-patients-list');
    allPat.empty();
    var entry = "";
    $.each(data, function(idx,record){
        $.each(record, function(idx,element){
            if(element ==null){
                entry += "<td>N/A</td>";

            }else{
                entry += "<td>"+ element + "</td>";
            }
        });
        allPat.append("<tr>" + entry+"</tr>");
        entry="";

    });


}

function getAllPatientsInfo(){
    //$("#view-all-records-of-patients").empty();

    $.ajax({
        type: 'GET',
        url: '../services/getAllPatientsInfo.php',
        dataType: 'json',
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response){
                populateAllPatients(data.results.patient_results);
            }else{
               // ShowResultModal(data);
            }

        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}
function populateUnusedEqupiment(data){
    var allEquip =  $('#unused-equipment-list');
    allEquip.empty();
    $.each(data, function(idx,record){
        allEquip.append("<tr><td>" + record.ename+"</td></tr>");
    });
}

function getUnusedEquipment(){
    $.ajax({
        type: 'GET',
        url: '../services/getUnusedEquipment.php',
        dataType: 'json',
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response){
                populateUnusedEqupiment(data.results.equipment);
            }else{
               // ShowResultModal(data);
            }

        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}

function populateTherapistsArePatients(data){
    var allPat =  $('#therapists-patients-list');
    allPat.empty();
    var entry = "";
    $.each(data, function(idx,record){
        $.each(record, function(idx,element){
            if(element ==null){
                entry += "<td>N/A</td>";

            }else{
                entry += "<td>"+ element + "</td>";
            }
        });
        allPat.append("<tr>" + entry+"</tr>");
        entry="";

    });

}

function getTherapistsArePatients(){
    $.ajax({
        type: 'GET',
        url: '../services/getTherapistsArePatients.php',
        dataType: 'json',
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response){
                populateTherapistsArePatients(data.results.patient_results);
            }else{
               // ShowResultModal(data);
            }

        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}

function populateAllTherapists(data){
    var allPat =  $('#all-therapists-list');
    allPat.empty();
    var entry = "";
    $.each(data, function(idx,record){
        $.each(record, function(idx,element){
            if(element ==null){
                entry += "<td>N/A</td>";

            }else{
                entry += "<td>"+ element + "</td>";
            }
        });
        allPat.append("<tr>" + entry+"</tr>");
        entry="";

    });

}

function getAllTherapists(){
    $.ajax({
        type: 'GET',
        url: '../services/getAllTherapists.php',
        dataType: 'json',
        beforeSend: ShowSpinner,
        complete: HideSpinner,
        success: function (data) {
            if (data.response){
                populateAllTherapists(data.results.patient_results);
            }else{
               // ShowResultModal(data);
            }

        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}






