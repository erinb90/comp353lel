<?php

include_once ("../utilities/DBConnector.php");

$returned_data = array("response" => false, "msg" => "", "status" => "Error", "results" => array("patient_results" => ""));

$db_connector = new DBConnector();

$patient_query= "SELECT
 medicalstaff.title,
 medicalstaff.sfirstname,
 medicalstaff.slastname,
 medicalstaff.licenseno,
 patient.phn,
 patient.firstname,
 patient.lastname,
 patient.dob,
 patient.gender,
 patient.email,
 appointment.date,
 appointment.time,
 prescription.diagnosis,
 prescription.notes,
 doctorprescription.medication,
 physioprescription.therapy,
 treatment.tname,
 equipment.ename

FROM medicalstaff
 LEFT JOIN referral
   ON medicalstaff.licenseno = referral.licenseno
 LEFT JOIN patient
   ON patient.phn = referral.phn
 LEFT JOIN appointment
   ON referral.serialno = appointment.serialno
 LEFT JOIN prescription
   ON appointment.apptid = prescription.apptid
 LEFT JOIN doctorprescription
   ON doctorprescription.prescriptionid=prescription.prescriptionid
 LEFT JOIN physioprescription
   ON physioprescription.prescriptionid=prescription.prescriptionid
 LEFT JOIN phyprestreatment
   ON phyprestreatment.prescriptionid=prescription.prescriptionid
 LEFT JOIN treatment
   ON phyprestreatment.treatmentid= treatment.treatmentid
 LEFT JOIN phypresequipment
   ON phypresequipment.prescriptionid=prescription.prescriptionid
 LEFT JOIN equipment
   ON phypresequipment.equipmentid=equipment.equipmentid
 WHERE medicalstaff.title ='Therapist';";


$patient_results = $db_connector->query_assoc($patient_query);


if (is_array($patient_results) && sizeof($patient_results) > 0){
    $returned_data["results"]["patient_results"] = $patient_results;
}else{
    $returned_data["msg"] = "Error fetching patient info";
    echo json_encode($returned_data);
    die();
}


$returned_data["response"] = true;
echo json_encode($returned_data);
