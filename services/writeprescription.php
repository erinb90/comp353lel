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

//form data common to both doctor and physio
$apptid = $_POST['apptid'];
$diagnosis = $_POST['diagnosis'];
$notes = $_POST['notes'];

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
    //form data only for doctor
    $medication = $_POST['medication'];

    //insert medication into doctor prescription table
    $dbc->query_assoc("INSERT INTO doctorprescription(prescriptionid,medication)
                        VALUES ('$prescriptionid','$medication')");
}

//physiotherapist prescription
else if($_SESSION['type'] == 'THERAPIST') {
    //form data only for physiotherapist
    $therapy = $_POST['therapy'];

    //@todo allow for multiple equipments and multiple treatments
    $equipment = $_POST['equipment'];
    $treatment = $_POST['treatment'];

    //insert therapy, equipment and treatment into physio prescription tables
    $dbc->query_assoc("INSERT INTO physioprescription(prescriptionid,therapy)
                        VALUES ('$prescriptionid','$therapy')");

    //make a loop to insert all equipment/treatment into db
    $dbc->query_assoc("INSERT INTO phypresequipment(prescriptionid,equipmentid)
                        VALUES ('$prescriptionid','$equipmentid')");
    $dbc->query_assoc("INSERT INTO physprestreatment(prescriptionid,treatmentid)
                        VALUES ('$prescriptionid','$treatmentid')");
}

//send a success message to front-end
$data['status'] = 'Success';
$data['msg'] = 'Prescription created!';
echo json_encode($data);

?>