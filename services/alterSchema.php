<?php
/**
 * Created by PhpStorm.
 * User: Erin
 * Date: 8/8/2017
 * Time: 11:14 PM
 */
include_once('../utilities/DBConnector.php');

$dbc = new DBConnector();

$data = array();

$phn = $_POST['phn_alter'];
$column = $_POST['column_alter'];
$value = $_POST['value_alter'];

//make sure phn exists
$exists = $dbc->query_assoc("SELECT phn FROM patient WHERE phn='$phn'");

if(!$exists) {
    $data['status'] = 'Failure';
    $data['msg'] = 'Patient with this PHN does not exist';
    echo json_encode($data);
    die();
}

//add the new column to patient schema
$dbc->query_assoc("ALTER TABLE patient
                    ADD $column VARCHAR(255)");

//add the value
$dbc->query_assoc("UPDATE patient
                  SET $column = '$value'
                  WHERE phn='$phn'");

$data['status'] = 'Success';
$data['msg'] = 'Patient schema altered!';
echo json_encode($data);
