<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 07-Aug-2017
 * Time: 00:30
 */

include_once("../utilities/DBConnector.php");

$returned_data = array("msg" => "", "status" => "Error");

if (!array_key_exists("referral-phn", $_POST) || !array_key_exists("referral-serialnumber", $_POST) ||
    !array_key_exists("referral-licencenumber", $_POST)){
    $returned_data["msg"] = "Missing Information to register referral";
    echo json_encode($returned_data);
    die();
}

$db_connector = new DBConnector();

$patient_phn = $_POST["referral-phn"];
$serial_no = $_POST["referral-serialnumber"];
$license_no = $_POST["referral-licencenumber"];
$trainer_lastname = array_key_exists("referral-trainerlastname", $_POST) ? $_POST["referral-trainerlastname"] : "";
$trainer_firstname = array_key_exists("referral-trainerfirstname", $_POST) ? $_POST["referral-trainerfirstname"] : "";

// Check that staff license no exists
$select_staff_query = "SELECT licenseno FROM medicalstaff WHERE licenseno='$license_no';";
$results = $db_connector->query_num($select_staff_query);
if (sizeof($results) == 0){
    $returned_data["msg"] = "Unable to find staff with that license no.";
    echo json_encode($returned_data);
    die();
}

// Check that Patient PHN exists
$select_patient_query = "SELECT phn FROM patient WHERE phn='$patient_phn';";
$results = $db_connector->query_num($select_patient_query);
if (sizeof($results) == 0){
    $returned_data["msg"] = "Unable to find patient with that PHN. Register Patient first if necessary.";
    echo json_encode($returned_data);
    die();
}

// Check that referral is not already registered
$select_referral_query = "SELECT serialno FROM referral WHERE serialno='$serial_no';";
$results = $db_connector->query_num($select_referral_query);
if (sizeof($results) > 0){
    $returned_data["msg"] = "Referral has already been registered in the system.";
    echo json_encode($returned_data);
    die();
}

$query = "
    INSERT INTO referral (serialno, trainerfname, trainerlname, licenseno, phn) 
    VALUES ('$serial_no', '$trainer_firstname', '$trainer_lastname', '$license_no', '$patient_phn'); 
";

$results = $db_connector->query_assoc($query);

if (is_bool($results) && $results){
    $returned_data["msg"] = "Referral has been successfully registered in the system.";
    $returned_data["status"] = "Success";
}elseif (!$results){
    $returned_data["msg"] = "Unable to register the referral";
}

echo json_encode($returned_data);
