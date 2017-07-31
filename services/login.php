<?php
/**
 * Created by PhpStorm.
 * User: Erin
 * Date: 7/31/2017
 * Time: 11:35 AM
 */
    include_once('../utilities/DBConnector.php');

    //connect to db
    $dbc = new DBConnector();


    //send the form data
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    //query db to find user
    //@todo hash passwords in db for security
    $result = $dbc->query_assoc("SELECT * FROM users WHERE username='$username' and password='$password'");

    if($result) {
        //start session
        session_start();

        $_SESSION['username'] = $result[0]['username'];

        //redirect depending on user title
        if ($result[0]['title'] == 'physician') {
            ?>
            <script>window.location.replace("/pages/Physician.html");</script>
            <?php
        }
        else if ($result[0]['title'] == 'receptionist') {
            ?>
            <script>window.location.replace("/pages/Receptionist.html");</script>
            <?php
        }
    }

    else
    {
        ?>
        <script>
            window.alert("invalid credentials");
            window.location.replace("/index.html");
        </script>
        <?php
    }


?>