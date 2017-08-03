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

        //redirect depending on user type
        if ($result[0]['type'] == 'physician') {
            echo 'physician';
        }
        else if ($result[0]['type'] == 'receptionist') {
            echo 'receptionist';
        }
        else if ($result[0]['type'] == 'patient') {
            echo 'patient';
        }

    }

    else
    {
        echo 'Invalid credentials';

    }

?>