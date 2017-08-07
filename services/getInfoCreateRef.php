<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 07-Aug-2017
 * Time: 10:30
 */

include_once ("../utilities/DBConnector.php");

$returned_data = array("response" => false, "msg" => "", "status" => "Error", "results" => array("patient_results" => "", "staff_info" => ""));

$db_connector = new DBConnector();

$patient_query = "SELECT
  phn,
  firstname f_name,
  lastname l_name
FROM patient;";

$patient_results = $db_connector->query_assoc($patient_query);

if (is_array($patient_results) && sizeof($patient_results) > 0){
    $returned_data["results"]["patient_results"] = $patient_results;
}else{
    $returned_data["msg"] = "Error fetching patient info";
    echo json_encode($returned_data);
    die();
}

$staff_query = "SELECT
  licenseno,
  sfirstname f_name,
  slastname l_name
FROM medicalstaff;";

$staff_results = $db_connector->query_assoc($staff_query);

if (is_array($staff_results) && sizeof($staff_results) > 0){
    $returned_data["results"]["staff_info"] = $staff_results;
}else{
    $returned_data["msg"] = "Error fetching staff info";
    echo json_encode($returned_data);
    die();
}

$returned_data["response"] = true;
echo json_encode($returned_data);