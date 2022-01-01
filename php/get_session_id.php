<?php

// esse script recebe um POST com o usuario logado e retorna o session_id associado
// procura a maquina correta e o session_id
// APENAS ENFERMAGEM

funcion get_session_id_enf($username){
    // configuracao do server mysql
    $DATABASE_HOST = '18.230.68.85';
    $DATABASE_USER = 'cetam';
    $DATABASE_PASS = 'Spock1701a!';
    $DATABASE_NAME = 'cetam';
    // Try and connect using the info above.
    $con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
    if ( mysqli_connect_errno() ) {
    	// If there is an error with the connection, stop the script and display the error.
    	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
    }

    //$username = "enf2";

    if ($stmt = $con->prepare('SELECT user_id FROM accounts WHERE username = ?')) {
    	// Bind parameters (s = string, i = int, b = blob, etc), in our case the username is a string so we use "s"
    $stmt->bind_param('s', $username/*$_POST['username']*/);
    	$stmt->execute();
    	// Store the result so we can check if the account exists in the database.
    	$stmt->store_result();

      if ($stmt->num_rows > 0) {
      	$stmt->bind_result($user_id);
      	$stmt->fetch();
      }
    }

    if ($stmt = $con->prepare('SELECT marca,session_id FROM maquinas m INNER JOIN enfermagem e on m.id = e.maquina_id INNER JOIN accounts a on e.id = a.user_id WHERE a.user_id = ?')) {
    	// Bind parameters (s = string, i = int, b = blob, etc), in our case the username is a string so we use "s"
    	$stmt->bind_param('i', $user_id);
    	$stmt->execute();
    	// Store the result so we can check if the account exists in the database.
    	$stmt->store_result();

      if ($stmt->num_rows > 0) {
      	$stmt->bind_result($marca, $session_id);
      	$stmt->fetch();
      }
    }

    $mySessionInfo->usertype = "enfermagem";
    $mySessionInfo->session_id = $session_id;
    $mySessionInfo->username = $username;

    $mySessionJSON = json_encode($mySessionInfo);
    $fp = fopen('../../json/session-enfermagem.json', 'w');
    fwrite($fp, $mySessionJSON);
    fclose($fp);
    echo $mySessionJSON;
}
?>
