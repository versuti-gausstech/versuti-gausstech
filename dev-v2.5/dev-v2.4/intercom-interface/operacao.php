<?php
//$my_id = $_GET["id"];
//setcookie("my_id", $my_id);

$fh = fopen('intercom.mac','r');
while ($line = fgets($fh)) {
  // <... Do your work with the line ...>
  // echo($line);
  //echo('Mac: ' . $line);
  $mac = str_replace(array("\r\n", "\r", "\n"), '', $line);
}
fclose($fh);
setcookie("my_id", $mac);
?>

<html>
	<head>
        <meta charset="utf-8">
        <title>gauss COMMAND</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link href="css/home-style.css" rel="stylesheet" type="text/css">
        <link href="css/general.css" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>

        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
        <script type="text/javascript" src="js/config.js"></script>
        <script type="text/javascript" src="js/mqtt-intercom.js"></script>
        <script type="text/javascript" src="js/intercom.js"></script>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	</head>

	<body class="loggedin">
		<div class="sidenav">
            <div class="icon-bar-left">
                <a class="active" href="#"><i class="fa fa-home" style='font-size:45px;' title="Home"></i></a> 
                <a href="#"><i class="fa fa-cog" style='font-size:45px;' title="Administração do Sistema"></i></a>
                <a href="../../logout.php"><i class="fa fa-sign-out-alt" style='font-size:45px;' title="Logout"></i></a> 
            </div>
		</div>
		<div class="main">
			<div class="container" style="padding:20px;">
                <div class="row h-75">
                    <div style="background:white;" class="col-9">
                    <div id="subscriber" class="subscriber"></div><br>
                    </div>
                    <div class="col-3">
                        <div id="publisher" class="publisher"></div>
                    </div>
                </div>
            </div>
            <br>
            <h2>Intercom Philips Intera - Unidade 3</h2>
        </div>
  </body>
</html>
