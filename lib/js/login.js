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
                if(data == 'physician') {
                    window.location.assign("pages/Physician.html");
                }
                else if(data == 'receptionist') {
                    window.location.assign("pages/Receptionist.html");
                }
                else if(data == 'patient') {
                    window.location.assign("pages/Patient.html");
                }
                else {
                    alert(data);
                }
            }
        });

    });

});
