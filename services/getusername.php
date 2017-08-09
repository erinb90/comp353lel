<?php
/**
 * Created by PhpStorm.
 * User: Erin
 * Date: 8/3/2017
 * Time: 2:35 PM
 */
    session_start();

    if(! array_key_exists('type', $_SESSION)){
        echo "error";
    }

    else if(strpos(strtolower(getallheaders()['Referer']), strtolower($_SESSION['type'])) == false){
        echo "error";
    }
    
    else{
        if(!isset($_SESSION['username'])){
            echo "error";
        }
        else {
            echo $_SESSION['username'];
        }
    }

?>