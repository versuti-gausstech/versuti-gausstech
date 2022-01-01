<?php
session_start();
// Change this to your connection info.
$DATABASE_HOST = '54.94.113.166';
$DATABASE_USER = 'cetam';
$DATABASE_PASS = 'Spock1701a!';
$DATABASE_NAME = 'cetam';
// Try and connect using the info above.
$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	// If there is an error with the connection, stop the script and display the error.
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

// Now we check if the data from the login form was submitted, isset() will check if the data exists.
if ( !isset($_POST['username'], $_POST['password']) ) {
	// Could not get the data that should have been sent.
	exit('Você precisa preencher ambos os campos!');
}

// Prepare our SQL, preparing the SQL statement will prevent SQL injection.
if ($stmt = $con->prepare('SELECT id, password, usertype, user_id FROM accounts WHERE username = ?')) {
	// Bind parameters (s = string, i = int, b = blob, etc), in our case the username is a string so we use "s"
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	// Store the result so we can check if the account exists in the database.
	$stmt->store_result();

  if ($stmt->num_rows > 0) {
  	$stmt->bind_result($id, $password, $usertype, $user_id);
  	$stmt->fetch();
  	// Account exists, now we verify the password.
  	// Note: remember to use password_hash in your registration file to store the hashed passwords.
  	if (password_verify($_POST['password'], $password)) {
  		// Verification success! User has logged-in!
  		// Create sessions, so we know the user is logged in, they basically act like cookies but remember the data on the server.
  		session_regenerate_id();
  		$_SESSION['loggedin'] = TRUE;
  		$_SESSION['name'] = $_POST['username'];
  		$_SESSION['id'] = $id;
			$_SESSION['usertype'] = $usertype;
			$_SESSION['user_id'] = $user_id;

			if ($usertype == 'intercom'){
					header('Location: intercom.html');
			}
			//************************************************************************************
			if ($usertype == 'enfermagem'){
				if ($stmt = $con->prepare('SELECT user_id FROM accounts WHERE username = ?')) {
		    $stmt->bind_param('s', $_POST['username']);
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
		    $mySessionInfo->username = $_POST['username'];

		    $mySessionJSON = json_encode($mySessionInfo);
		    $fp = fopen('json/session-enfermagem.json', 'w');
		    fwrite($fp, $mySessionJSON);
		    fclose($fp);
				header('Location: home-enfermagem.php');
			}
			if ($usertype == 'admin'){
				header('Location: admin.php');
			}
  	} else {
  		// Incorrect password
  		echo 'Incorrect username and/or password!';
  	}
  } else {
  	// Incorrect username
  	echo 'Incorrect username and/or password!';
  }


	$stmt->close();
}



?>
