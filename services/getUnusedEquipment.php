<?php

include_once ("../utilities/DBConnector.php");

$returned_data = array("response" => false, "msg" => "", "status" => "Error", "results" => array("equipment" => ""));

$db_connector = new DBConnector();

$equipment_query= "SELECT equipment.ename
FROM equipment
WHERE equipment.equipmentid <> ALL(
 SELECT phypresequipment.equipmentid
 FROM phypresequipment);";


$equipment_results = $db_connector->query_assoc($equipment_query);


if (is_array($equipment_results) && sizeof($equipment_results) > 0){
    $returned_data["results"]["equipment"] = $equipment_results;
}else{
    $returned_data["msg"] = "Error fetching patient info";
    echo json_encode($returned_data);
    die();
}


$returned_data["response"] = true;
echo json_encode($returned_data);
