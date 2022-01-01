<html>
  <?php
    setcookie("my_id", $_GET["id"]);
  ?>
<head>
    <title> CETAM - Command Center </title>
    <meta charset="utf-8"/>
    <meta name= "viewport" content= "width = device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
    <script type="text/javascript" src="js/mqtt.js"></script>
    <script type="text/javascript" src="js/command.js"></script>
</head>
<body>
  <h2>Módulo de Áudio Command Gauss Tech</h2>
  <label>Meu id : <?php echo($_GET["id"]);?></label><br>
    <div id="videos">
        <div id="subscriber"></div>
        <div id="publisher"></div>
    </div>
    <br>
</body>
</html>
