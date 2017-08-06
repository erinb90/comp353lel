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

    //data to pass to front-end
    $data = array();

    //send the form data
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    //query db to find user
    $result = $dbc->query_assoc("SELECT * FROM users WHERE username='$username' and password='$password'");

    //user found in db
    if($result) {
        //start session
        session_start();

        //set session variables
        $_SESSION['username'] = $result[0]['username'];
        $_SESSION['type'] = $result[0]['type'];

        $data['response'] = 1;
        $data['username'] = $result[0]['username'];
        $data['type'] = $result[0]['type'];
    }

    //user not found in db
    else
    {
        $data['response'] = 0;
        $data['error'] = 'Invalid credentials';
    }

    //send data to front-end
    echo json_encode($data);

?>