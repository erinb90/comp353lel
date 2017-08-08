<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 07-Aug-2017
 * Time: 23:55
 */

include_once("../utilities/DBConnector.php");

$returned_data = array("msg" => "", "status" => "Failed");

if (!array_key_exists("s_license_no", $_POST) || !array_key_exists("s_firstname", $_POST) || !array_key_exists("s_lastname", $_POST)) {
    $returned_data["msg"] = "Missing information";
    echo json_encode($returned_data);
    die();
}

$db_connector = new DBConnector();

$license_no = $_POST["s_license_no"];
$first_name = $_POST["s_firstname"];
$last_name = $_POST["s_lastname"];

$update_query = "UPDATE medicalstaff 
SET sfirstname='$first_name', slastname='$last_name' 
WHERE licenseno='$license_no'";

$result = $db_connector->query_assoc($update_query);

if (is_bool($result) && $result){
    $returned_data["msg"] = "Staff details update successfully";
    $returned_data["status"] = "Success";
}else{
    $returned_data["msg"] = "Unable to update record";
}

echo json_encode($returned_data);
