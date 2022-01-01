<html>
<?php
//$my_id = $_GET["id"];
//setcookie("my_id", $my_id);

$fh = fopen('/sys/class/net/eth0/address','r');
while ($line = fgets($fh)) {
  // <... Do your work with the line ...>
  // echo($line);
  //echo('Mac: ' . $line);
  $mac = str_replace(array("\r\n", "\r", "\n"), '', $line);
  $mac = str_replace(':', '', $mac);

}
fclose($fh);
setcookie("my_id", $mac);

?>
<head>
    <title> CETAM - Command Center </title>
    <meta charset="utf-8"/>
    <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
    <script type="text/javascript" src="js/config.js"></script>
    <script type="text/javascript" src="js/mqtt-intercom.js"></script>
    <script type="text/javascript" src="js/intercom.js"></script>
    <link rel="stylesheet" href="css/divs.css">

</head>

<body>
  <div>

  <div class="container">
  <div class="corpo">

      <iframe
        src="https://tokbox.com/embed/embed/ot-embed.js?embedId=128d5e6a-d95b-43f7-99aa-b2c2e4539e76&room=DEFAULT_ROOM&iframe=true"
        width="400px"
        height="320px"
        scrolling="auto"
        allow="microphone; camera"
      ></iframe>
    
    <div class="painel"><br><br><br></div>
    <div class="opentok"></div>
    <div id="subscriber" class="subscriber"></div>
    <div id="publisher" class="publisher"></div>
  </div>
  <div class="titulo">
  <h2>Módulo de Áudio Intercom Gauss Tech (<?php echo($mac);?>)</h2><br>
  <label>Meu id : <?php echo($mac); ?></label><br>
  </div>
</div>
<div>

</div>
    
</body>
</html>
