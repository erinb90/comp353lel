<?php
/**
* Polina Anis'kina
* ID:26991092
*/

include_once('../utilities/DBConnector.php');
session_start();

$dbc = new DBConnector();
$redirect_flag = true;

//checking user authentication level "NURSE, DOCTOR, THERAPIST"
if (array_key_exists("type", $_SESSION) &&
    ($_SESSION["type"] == "DOCTOR" || 
        $_SESSION["type"] == "THERAPIST" ||
          $_SESSION["type"] == "NURSE" ||
            $_SESSION["type"] == "RECEPTIONIST")) {
            $redirect_flag = false;
}

if($redirect_flag){
    return header("Location: ../pages/Login.html",true);
}


$data = array();

$phnsearch = $_GET['phn-search'];

$result = $dbc->query_assoc("SELECT * FROM patient WHERE phn='$phnsearch'");

if($result){
$data['phn'] = $result[0]['phn'];
$data['firstname'] = $result[0]['firstname'];
$data['lastname'] = $result[0]['lastname'];
$data['dateofbirth'] = $result[0]['dob'];
$data['gender'] = $result[0]['gender'];
$data['email'] = $result[0]['email'];
$data['status'] = true;
}
else{
  $data['msg'] = 'Patient does not exist';
  $data['status'] = false;

}

echo json_encode($data);
