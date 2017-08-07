<?php
/**
 * Created by PhpStorm.
 * User: mikce_000
 * Date: 07-Aug-2017
 * Time: 11:24
 */

include_once ("../utilities/DBConnector.php");

$returned_data = array("response" => false, "msg" => "", "status" => "Error", "results" => null);

$db_connector = new DBConnector();

$query = "SELECT 
  r.serialno serial_no
FROM referral AS r
LEFT JOIN appointment AS a ON a.serialno=r.serialno
WHERE
  a.serialno IS NULL";

$results = $db_connector->query_num($query);

if(is_array($results)){
    $returned_data["results"] = $results;
    $returned_data["response"] = true;
}else{
    $returned_data["msg"] = "Unable to fetch license no";
}

echo json_encode($returned_data);
