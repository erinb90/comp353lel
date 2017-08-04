$(document).ready(function() {

    $('#login-submit').click(function() {

        $.ajax({
            type: "POST",
            url: "/services/login.php",
            dataType: "json",
            data: {
                username: $("#username").val(),
                password: $("#password").val()
            },
            success: function(data)
            {
                if(data.response == 1) {
                    //redirect depending on user type
                    switch(data.type.toUpperCase()) {
                        case 'PATIENT':
                            window.location.assign("pages/Patient.html");
                            break;
                        case 'NURSE':
                            window.location.assign("pages/Nurse.html");
                            break;
                        case 'DOCTOR':
                            window.location.assign("pages/Physician.html");
                            break;
                        case 'THERAPIST':
                            window.location.assign("pages/Physiotherapist.html");
                            break;
                        case 'RECEPTIONIST':
                            window.location.assign("pages/Receptionist.html");
                            break;
                    }
                }
                else {
                    alert(data.error);
                }

            }

        })

    });

});

