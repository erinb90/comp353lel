<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 06-Aug-2017
 * Time: 14:36
 */

include_once("../utilities/DBConnector.php");

$db_connector = new DBConnector();

session_start();

// Default username
$license_no = "%";

// Get the license no when doctor/physio looking at appointments
if ($_SESSION["type"] == "DOCTOR" || $_SESSION["type"] == "THERAPIST"){
    $license_no = $_SESSION["username"];
}

// Query to get all appointments (Add the username depending on the login type)
$query = "SELECT
  r.phn,
  CONCAT(p.firstname, ' ', p.lastname) patient,
  CONCAT(ms.sfirstname, ' ' ,ms.slastname) doctor,
  apt.date,
  apt.time
FROM appointment AS apt
  JOIN referral AS r ON r.serialno = apt.serialno
  JOIN medicalstaff AS ms ON ms.licenseno = r.licenseno
  JOIN patient AS p ON p.phn = r.phn
WHERE
  ms.licenseno LIKE '$license_no'
ORDER BY apt.date DESC";

$results = $db_connector->query_assoc($query);

// Data array to be returned
$returned_data = array();
if ($results){
    $returned_data["response"] = 1;
    $returned_data["results"] = $results;
}else{
    $returned_data["response"] = 0;
    $returned_data["err_message"] = "Unable to fetch data";
}

// Send data to front-end
echo json_encode($returned_data);

