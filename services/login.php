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

    //user found in db
    if($result) {
        //start session
        session_start();

        $_SESSION['username'] = $result[0]['username'];

        //output the user type for js redirect
        echo $result[0]['type'];
    }

    //user not found in db
    else
    {
        echo 'Invalid credentials';
    }

?>