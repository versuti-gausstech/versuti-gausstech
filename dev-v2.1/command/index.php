<html>
<?php
$my_id = $_GET["id"];
setcookie("my_id", $my_id);
?>
<head>
    <title> CETAM - Command Center </title>
    <meta name= "viewport" content= "width = device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
</head>
<body>
    <div>
        <h2>Módulo de Áudio Command Center Gauss Tech</h2><br>
        <label>Meu id : <?php echo($_GET["id"]); ?></label>
    </div>
    <div id="videos">
        <div id="subscriber"></div>
        <div id="publisher"></div>
    </div>
    <br>
    <script type="text/javascript" src="js/mqtt-command.js"></script>
    <script type="text/javascript" src="js/command.js"></script>
</body>
</html>
