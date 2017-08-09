<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 07-Aug-2017
 * Time: 23:31
 */

include_once ("../utilities/DBConnector.php");

$returned_data = array("response" => false, "status" => "Error", "msg" => "", "results" => null);

$db_connector = new DBConnector();

$staff_license_no = "%";
if (array_key_exists("staff_license_no", $_POST) && isset($_POST["staff_license_no"])){
    $staff_license_no = $_POST["staff_license_no"];
}

$staff_query = "SELECT 
    licenseno license_no,
    sfirstname first_name,
    slastname last_name,
    title staff_title
FROM medicalstaff
WHERE licenseno LIKE '$staff_license_no';";

$results = $db_connector->query_assoc($staff_query);

if (is_array($results)){
    if (sizeof($results) > 0){
        $returned_data["results"] = $results;
        $returned_data["response"] = true;
        $returned_data["status"] = "Success";
    }else{
        $returned_data["msg"] = "No staff could be found";
    }
}else{
    $returned_data["msg"] = "Unable to fetch staff records";
}

echo json_encode($returned_data);
