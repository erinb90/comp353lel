<?php
/* Polina Anis'kina ID: 26991092 */

include_once('../utilities/DBConnector.php');
session_start();

$dbc = new DBConnector();
$redirect_flag = true;

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

$phn = $_POST['phn'];
$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$gender = 'M';
$dob = $_POST['dateofbirth'];
$email = $_POST['email'];

$query = "UPDATE patient SET firstname = '$firstname',
         lastname = '$lastname', gender = '$gender', dob = '$dob', email = '$email'
         WHERE phn='$phn'";

$result = $dbc->query_assoc($query);

$data["status"] = true;
$data["message"] = "Feken has been added";

echo json_encode($data);
?>
