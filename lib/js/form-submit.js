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
                ShowResultModal(msg);
                HideSpinner();
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

// method to create json obj from the form inputs
function parseField($object) {
    result = {}
    $object.find('select[value!=""], input[value!=""]').each(function () {
        key = $(this).attr('name').toString();
        val = $(this).val().toString()
        result[key] = val;
    });
    return result;
}
