<?php

/* Polina Anis'kina ID: 26991092 */

include_once('../utilities/DBConnector.php');
session_start();

$redirect_flag = true;

//checking user authentication level "receptionist only"
if (array_key_exists("type", $_SESSION) &&
    ($_SESSION["type"] == "RECEPTIONIST")){
            $redirect_flag = false;
}

if($redirect_flag){
    return header("Location: ../pages/Login.html",true);
}

$dbc = new DBConnector();

$data = array("status" => "Success", "msg" => "");

$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$dob = $_POST['dateofbirth'];
$gender = $_POST['sex'];
$email = $_POST['email'];
$password = $_POST['password'];

if (isset($dob)){
    $date = date_parse($dob);
    $age = (int)getdate()["year"] - (int)$date["year"];
    if ($age < 18){
        $data["msg"] = "Invalid Age. Need to be at least 18";
        echo json_encode($data);
        die();
    }
}

/*phn generator*/
$l_name = substr($lastname,0,3);
$f_name = substr($firstname,0,1);
if($gender = 'F'){
  $gen = substr($dob,5,2)+ 50;
} else{
  $gen = substr($dob,5,2);
}
$dob_format = substr($dob,2,2).$gen.substr($dob,8,2);

$phn =  strtoupper($l_name).strtoupper($f_name).$dob_format;
/*end of phn generator*/

// Check PHN exists
$check_phn_query = "SELECT phn FROM patient WHERE phn='$phn'";
$check_results = $dbc->query_assoc($check_phn_query);
if (is_array($check_results) && sizeof($check_results) > 0){
    $data["status"] = "Failure";
    $data["msg"] = "PHN already exists in the DB. Change the names if possible.";
    echo json_encode($data);
    die();
}

$patient_query = "INSERT INTO patient (phn, firstname, lastname, dob, gender, email)
          VALUES ('$phn','$firstname','$lastname','$dob','$gender','$email')";

$patient_result = $dbc->query_assoc($patient_query);

$users_query = "INSERT INTO users (username, password, type)
                    VALUES ('$phn','$password','PATIENT')";

$user_result = $dbc->query_assoc($users_query);

if (is_bool($patient_result) && is_bool($user_result) && $patient_result && $user_result){
    $data["status"] = "Success";
}else{
    $data["status"] = "Failure";
    $data["msg"] = "Unable to insert new patient record";
}

echo json_encode($data);
