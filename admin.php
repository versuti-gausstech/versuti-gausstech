<?php
// pagina de admin do sistema
// busca os operadores, mostra na tela e da opcao de designar maquinas e criar
// estacoes de trabalho (1 estacao com ate 3 maquinas)
// marcio versuti - gausstech.io apr-03-2021

// We need to use sessions, so you should always start sessions using the below code.
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 'On');

// If the user is not logged in redirect to the login page...
if (!isset($_SESSION['loggedin'])) {
	header('Location: index.html');
	exit;
}

$config = parse_ini_file("./webservice-php/db_config.ini");

// configuracao do server mysql
$DATABASE_HOST = $config['dbhost'];
$DATABASE_USER = $config['dbuser'];
$DATABASE_PASS = $config['dbpass'];
$DATABASE_NAME = $config['dbname'];
$project       = $config['project'];
?>

<html>
	<head>
		<meta charset="utf-8">
		<title>Gauss Command</title>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
		<link href="css/home-style.css" rel="stylesheet" type="text/css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">

    <script src="mqtt.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js" charset="utf-8"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js" charset="utf-8"></script>
    <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
    <style>
      img{
          max-width: 49.6%;
          align: center;
          display: inline-block; /* remove extra space below image */
      }
    </style>

	</head>
	<body class="loggedin">
		<nav class="navtop">
			<div>
				<h1>CETAM - <?php echo "Logado como: {$_SESSION['usertype']}"; ?></h1>
				<a href="profile.php"><i class="fas fa-user-circle"></i>Perfil</a>
				<a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a>
			</div>
		</nav>
    <h3>Página de administração do sistema</h3>
		<h4>Operadores</h4>
		<?php
			// Create connection
			$conn = new mysqli($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
			// Check connection
			if ($conn->connect_error) {
			  die("Connection failed: " . $conn->connect_error);
			}

			// pega apenas os biomedicos (usertype = biomedico)
			$sql = "SELECT username, email FROM accounts WHERE usertype = 'biomedico'";
			$result = $conn->query($sql);

			if ($result->num_rows > 0) {
			  // output data of each row
				echo "<div>";
			  while($row = $result->fetch_assoc()) {
					// adiciona um checkbox para cada operador ( username - email )
					echo "<input type='checkbox' id='". $row["username"]. "' name='" .$row["username"]. "' ><label for='operadores'> " .$row["username"]. " - " .$row["email"]. "</label><br>";
			  }
				echo "</div>";
			} else {
			  echo "0 results";
			}
			$conn->close();

		?>

  </body>
</html>
