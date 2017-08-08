<?php
/**
 * Created by PhpStorm.
 * User: Erin
 * Date: 8/6/2017
 * Time: 3:08 PM
 */

include_once('../utilities/DBConnector.php');
session_start();

$redirect_flag = true;

if (array_key_exists("type", $_SESSION) &&
    ($_SESSION["type"] == "DOCTOR" ||
        $_SESSION["type"] == "THERAPIST")) {
                 $redirect_flag = false;
}

if($redirect_flag){
    return header("Location: ../pages/Login.html",true);
}

//connect to db
$dbc = new DBConnector();

//form data common to both doctor and physio
$apptid = $_POST['apptid'];
$diagnosis = $_POST['diagnosis'];
$notes = $_POST['notes'];

//make sure notes is no more than 100 words
$words = explode(" ", $notes);
if(count($words)>100) {
    $data['status'] = 'Error';
    $data['msg'] = 'Note exceeds the maximum of 100 words';
    echo json_encode($data);
    exit;
}

//make sure the appointment id exists
$result = $dbc->query_assoc("SELECT apptid
                                    FROM appointment
                                    WHERE apptid='$apptid'");

//send error msg and exit script if appointment does not exist
if(!$result) {
    $data['status'] = 'Error';
    $data['msg'] = 'Appointment does not exist';
    echo json_encode($data);
    exit;
}

//check if appointment id already has prescription
$result = $dbc->query_assoc("SELECT apptid
                                    FROM prescription
                                    WHERE apptid='$apptid'");

//send error and exit script if appointment already has prescription
if($result) {
    $data['status'] = 'Error';
    $data['msg'] = 'Appointment already has prescription';
    echo json_encode($data);
    exit;
}

//insert new entry into prescriptions table
$dbc->query_assoc("INSERT INTO prescription(apptid,diagnosis,notes)
                    VALUES ('$apptid','$diagnosis','$notes')");

//get the most recently added prescription id
$result = $dbc->query_assoc("SELECT prescriptionid
                              FROM prescription
                              ORDER BY prescriptionid DESC LIMIT 1");
$prescriptionid = $result[0]['prescriptionid'];

//doctor prescription
if($_SESSION['type'] == 'DOCTOR') {
    //get the medication
    $medication = $_POST['medication'];

    //insert medication into doctor prescription table
    $dbc->query_assoc("INSERT INTO doctorprescription(prescriptionid,medication)
                        VALUES ('$prescriptionid','$medication')");
}

//physiotherapist prescription
else if($_SESSION['type'] == 'THERAPIST') {
    //get the therapy
    $therapy = $_POST['therapy'];

    //insert therapy into physio prescription table
    $dbc->query_assoc("INSERT INTO physioprescription(prescriptionid,therapy)
                        VALUES ('$prescriptionid','$therapy')");

    //get all checked off equipment
    $equipment = $_POST['equipment'];

    //insert equipment into physio prescription equipment table
    foreach ($equipment as $key => $value) {
        $equipmentid = $value;
        $dbc->query_assoc("INSERT INTO phypresequipment(prescriptionid,equipmentid)
                        VALUES ('$prescriptionid','$equipmentid')");
    }

}

//send a success message to front-end
$data['status'] = 'Success';
$data['msg'] = 'Prescription created!';
echo json_encode($data);

?>