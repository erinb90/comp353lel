<?php
/**
 * Created by PhpStorm.
 * User: Erin
 * Date: 8/6/2017
 * Time: 3:08 PM
 */

include_once('../utilities/DBConnector.php');

session_start();

//connect to db
$dbc = new DBConnector();

$data = array();

//form data common to both doctor and physio
$apptid = $_POST['apptid'];
$diagnosis = $_POST['diagnosis'];
$notes = $_POST['notes'];

$dbc->query_assoc("INSERT INTO prescription(apptid,diagnosis,notes) VALUES ('$apptid','$diagnosis','$notes')");

//get the most recently added prescription id
$prescriptionid = [$dbc->query_assoc("SELECT prescriptionid FROM prescription ORDER BY prescriptionid DESC LIMIT 1")][0]['prescriptionid'];

//doctor prescription
if($_SESSION['type'] == 'DOCTOR') {
    $medication = $_POST['medication'];

    $dbc->query_assoc("INSERT INTO doctorprescription(prescriptionid,medication) VALUES ('$prescriptionid','$medication')");
}

//therapist prescription
else if($_SESSION['type'] == 'THERAPIST') {
    $therapy = $_POST['therapy'];
    $equipment = $_POST['equipment'];
    $treatment = $_POST['treatment'];

    //find equipment id from equipment name
    //find treatment id from treatment name
    $equipmentid = '';
    $treatmentid = '';

    $dbc->query_assoc("INSERT INTO physioprescription(prescriptionid,therapy) VALUES ('$prescriptionid','$therapy')");
    $dbc->query_assoc("INSERT INTO phypresequipment(prescriptionid,equipmentid) VALUES ('$prescriptionid','$equipmentid')");
    $dbc->query_assoc("INSERT INTO physprestreatment(prescriptionid,treatmentid) VALUES ('$prescriptionid','$treatmentid')");
}

$data['msg'] = 'Prescription made successfully!';
echo json_encode($data);

?>