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
function SubmitForm(endpoint) {
    if (ValidateForm($('form'))) {
        $.ajax({
            type: "POST",
            url: endpoint, //process to mail
            data: (parseField($('form'))),
            beforeSend: ShowSpinner,
            success: function (msg) {
                //TODO something to show when the patient is registered
            },
            error: function (err) {
                console.log(err);
                HideSpinner();
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
