<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 06-Aug-2017
 * Time: 14:36
 */

include_once("../utilities/DBConnector.php");
session_start();

$db_connector = new DBConnector();

// Default username
$phn = "%";

// Get the license no when doctor/physio looking at appointments
if (array_key_exists("type", $_SESSION) && ($_SESSION["type"] == "PATIENT"))
    $phn = $_SESSION["username"];

// If need to filter by date
$start_date = "0000-00-00";
$end_date = "9999-12-31";
if (isset($_POST["start_date"])) {
    $start_date = trim($_POST["start_date"]);
}

if (isset($_POST["end_date"])) {
    $end_date = trim($_POST["end_date"]);
}

// Query to get all appointments (Add the username depending on the login type)
$query = "SELECT
  r.serialno,
  r.phn,
  p.firstname p_firstname,
  p.lastname p_lastname,
  ms.licenseno,
  ms.sfirstname staff_firstname,
  ms.slastname staff_lastname,
  ms.title staff_title,
  apt.date,
  apt.time,
  apt.apptid appt_id
FROM appointment AS apt
  JOIN referral AS r ON r.serialno = apt.serialno
  JOIN medicalstaff AS ms ON ms.licenseno = r.licenseno
  JOIN patient AS p ON p.phn = r.phn
WHERE
  apt.date >= '$start_date'
  AND
  apt.date <= '$end_date'
  AND
  p.phn LIKE '$phn'
ORDER BY apt.date DESC, apt.time;";

$results = $db_connector->query_assoc($query);

// Data array to be returned
$returned_data = array("response" => false, "results" => null, "msg" => "");
if (is_array($results)){
    if (sizeof($results) > 0){
        $returned_data["response"] = true;
        $returned_data["results"] = $results;
    }else{
        $returned_data["msg"] = "No records found";
    }
}else{
    $returned_data["response"] = false;
    $returned_data["err_message"] = "Unable to fetch data";
}

// Send data to front-end
echo json_encode($returned_data);
