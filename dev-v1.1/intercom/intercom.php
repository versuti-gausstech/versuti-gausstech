<html>
<?php
$my_id = $_GET["id"];
setcookie("my_id", $my_id);
?>
<head>
    <title> CETAM - Command Center </title>
    <meta charset="utf-8"/>
    <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
    <script type="text/javascript" src="js/mqtt.js"></script>
    <script type="text/javascript" src="js/intercom.js"></script>

</head>

<body>
  <div>
  <h2>Módulo de Áudio Intercom Gauss Tech</h2><br>
  <label>Meu id : <?php echo($_GET["id"]); ?></label>
  </div>
  <div id="videos">
      <div id="subscriber"></div>
      <div id="publisher"></div>
  </div>
<br>
<div>

</div>
    
</body>
</html>
