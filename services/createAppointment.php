<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 06-Aug-2017
 * Time: 22:35
 */

include_once("../utilities/DBConnector.php");
session_start();

$returned_data = array("msg" => "", "status" => "Failed");
$redirect_flag = true;

//checking user authentication level "Receptionist and Patient"
if (array_key_exists("type", $_SESSION) &&
    ($_SESSION["type"] == "RECEPTIONIST" || 
        $_SESSION["type"] == "PATIENT")){
            $redirect_flag = false;
}

if($redirect_flag){
    return header("Location: ../pages/Login.html",true);
}

if (!array_key_exists("time_app", $_POST) || !array_key_exists("date_app", $_POST) || !array_key_exists("serial_number", $_POST)) {
    $returned_data["msg"] = "Missing information";
    echo json_encode($returned_data);
    die();
}

$db_connector = new DBConnector();

$appt_date = $_POST["date_app"];
$appt_time = $_POST["time_app"];
$serial_no = $_POST["serial_number"];

$query = "
    INSERT INTO appointment (date, time, serialno)
    VALUES ('$appt_date', '$appt_time', '$serial_no');
";

$result = $db_connector->query_assoc($query);

if (is_bool($result) && $result){
    $returned_data["msg"] = "Appointment added successfully";
    $returned_data["status"] = "Success";
}else{
    $returned_data["msg"] = "Unable to add appointment";
}

echo json_encode($returned_data);