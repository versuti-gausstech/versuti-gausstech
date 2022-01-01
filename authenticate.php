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
if ($stmt = $con->prepare('SELECT id, password, usertype, user_id, name, avatar_url FROM accounts WHERE username = ?')) {
	// Bind parameters (s = string, i = int, b = blob, etc), in our case the username is a string so we use "s"
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	// Store the result so we can check if the account exists in the database.
	$stmt->store_result();

  if ($stmt->num_rows > 0) {
  	$stmt->bind_result($id, $password, $usertype, $user_id, $name, $avatar_url);
  	$stmt->fetch();
  	// Account exists, now we verify the password.
  	// Note: remember to use password_hash in your registration file to store the hashed passwords.
  	if (password_verify($_POST['password'], $password)) {
  		// Verification success! User has logged-in!
  		// Create sessions, so we know the user is logged in, they basically act like cookies but remember the data on the server.
  		session_regenerate_id();
  		$_SESSION['loggedin'] = TRUE;
  		$_SESSION['username'] = $_POST['username'];
  		$_SESSION['id'] = $id;
		$_SESSION['usertype'] = $usertype;
		$_SESSION['user_id'] = $user_id;
		$_SESSION['name'] = $name;
		setcookie("username", $_POST['username']);

		$username_logged = $_POST['username'];
		if ($username_logged == 'nathalia'){
			setcookie("username", $_POST['username']);
			setcookie("usertype", $usertype);
			setcookie("name", $name);
			setcookie("screen_1", -1);
			setcookie("screen_2", -1);
			setcookie("screen_3", 1);
			setcookie("screen_3_intercom", "b827eb3da438");
			setcookie("screen_3_enfermagem", "enf-3");
			//header('Location: dev/pad/index.php?id=cc-1');
			header('Location: dev/pad/index.html?room=1');
		}
		if ($username_logged == 'biomedico'){
			setcookie("username", $_POST['username']);
			setcookie("usertype", $usertype);
			setcookie("name", $name);
			setcookie("screen_1", -1);
			setcookie("screen_2", 1);
			setcookie("screen_3", -1);
			setcookie("screen_2_intercom", "b827ebd97628");
			setcookie("screen_2_enfermagem", "enf-2");
			header('Location: dev/pad/index.php?id=cc-2');
		}

		if ($usertype == 'cryoservice'){
			header('Location: prod/config.php');
		} 

		if ($usertype == 'intercom'){
				//header('Location: dev/intercom-interface/index.html?displayName=' . $name);
				header('Location: https://jitsi.gausstech.io/' . $name . '#userInfo.displayName="' . $name . '"&config.prejoinPageEnabled=false&config.startWithVideoMuted=true&config.startWithAudioMuted=true&avatarUrl="https://i.ebayimg.com/images/g/RfQAAOSwxbhe1oQX/s-l300.jpg"');
		}
		//************************************************************************************
		if ($usertype == 'enfermagem'){
			if ($stmt = $con->prepare('SELECT user_id FROM accounts WHERE username = ?')) {
			// Bind parameters (s = string, i = int, b = blob, etc), in our case the username is a string so we use "s"
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
		//header('Location: dev/mobile/index.php');
		header('Location: https://jitsi.gausstech.io/' . $_POST['username'] . '#userInfo.displayName="' . $_POST['username'] . '"&config.prejoinPageEnabled=false&config.startWithVideoMuted=true&config.startWithAudioMuted=true&avatarUrl="https://i.ebayimg.com/images/g/RfQAAOSwxbhe1oQX/s-l300.jpg"');

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
