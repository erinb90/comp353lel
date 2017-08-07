// Method to validate forms
function ValidateForm(form) {
    var flag = true;

    form.each(function () {
        $(this).find(':input').each(function () {
            if ($(this).val() == "") {
                $(this).css("background", "red");
                flag = false;
            }
            else {
                $(this).css("background", "white");
            }
        });
    });
    return flag;
}

// Method to submit forms
// patient registration and when patient record is modified by doctor/nurse
function SubmitForm(endpoint, formID) {
    if (ValidateForm($("#"+formID))) {
        $.ajax({
            type: "POST",
            url: endpoint, //process to mail
            data: (parseField($("#"+formID))),
            beforeSend: ShowSpinner,
            complete: HideSpinner,
            dataType: "json",
            success: function (msg) {
                ShowResultModal(JSON.parse(msg));
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

// method to create json obj from the form inputs
function parseField($object) {
    var result = {};
    var equipment = {};
    var treatment = {};
    $object.find('select[value!=""], input[value!=""]').each(function () {
        if($(this).attr('type') != 'checkbox') {
            var key = $(this).attr('name').toString();
            var val = $(this).val().toString()
            result[key] = val;
        }
    });

    //process equipment and treatment checklists from prescription form
    $('#equipment_checklist :checked').each(function() {
        var checkkey = $(this).attr('name').toString();
        var checkval = $(this).val().toString();
        equipment[checkkey] = checkval;
    });
    $('#treatment_checklist :checked').each(function() {
        var checkkey = $(this).attr('name').toString();
        var checkval = $(this).val().toString();
        treatment[checkkey] = checkval;
    });
    result['equipment'] = equipment;
    result['treatment'] = treatment;
    return result;
}
