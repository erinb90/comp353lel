<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 06-Aug-2017
 * Time: 18:35
 */

include_once("../utilities/DBConnector.php");
session_start();

$db_connector = new DBConnector();
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




$returned_data = array("response"=>false, "message"=>"", "results"=>[]);

if (!isset($_POST["serialno"])){
    $returned_data["message"] = "No serial number passed";
    echo json_encode($returned_data);
    die();
}

$referral_serial = trim($_POST["serialno"]);

$query = "SELECT
  serialno serial_no,
  trainerfname trainer_first_name,
  trainerlname trainer_last_name,
  licenseno staff_license_no,
  phn patient_phn
FROM referral
WHERE
  serialno = '$referral_serial';";

$results = $db_connector->query_first_row($query);

if ($results){
    $returned_data["response"] = true;
    $returned_data["results"] = $results;
}else{
    $returned_data["message"] = "Error while running query";
}

echo json_encode($returned_data);