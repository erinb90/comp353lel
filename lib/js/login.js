$(document).ready(function() {

    $('#login-submit').click(function() {

        $.ajax({
            type: "POST",
            url: "/services/login.php",
            data: {
                username: $("#username").val(),
                password: $("#password").val()
            },
            success: function(data)
            {
                //redirect depending on user type
                switch(data.toUpperCase()) {
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
                    default: //invalid login - show error msg
                        alert(data);
                }

            }
        });

    });

});
