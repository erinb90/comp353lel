<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 08-Aug-2017
 * Time: 00:51
 */

include_once("../utilities/DBConnector.php");

$returned_data = array("msg" => "", "status" => "Failed");

if (!array_key_exists("time_app", $_POST) || !array_key_exists("date_app", $_POST)
    || !array_key_exists("serial_number", $_POST) || !array_key_exists("appt_id", $_POST)) {
    $returned_data["msg"] = "Missing information";
    echo json_encode($returned_data);
    die();
}

$db_connector = new DBConnector();

$appt_date = $_POST["date_app"];
$appt_time = $_POST["time_app"];
$serial_no = $_POST["serial_number"];
$appt_id = $_POST["appt_id"];

$query = "
    UPDATE appointment 
    SET 
      date='$appt_date', 
      time='$appt_time'
    WHERE
      apptid='$appt_id'
      AND 
      serialno='$serial_no';
";

$result = $db_connector->query_assoc($query);

if (is_bool($result) && $result){
    $returned_data["msg"] = "Appointment modified successfully";
    $returned_data["status"] = "Success";
}else{
    $returned_data["msg"] = "Unable to edit appointment";
}

echo json_encode($returned_data);