<html>
<?php
$my_id = $_GET["id"];
setcookie("my_id", $my_id);
?>
<head>
    <title>CETAM - Command Center </title>
    <meta name= "viewport" content= "width = device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>

    <script src="https://use.fontawesome.com/releases/v5.15.3/js/all.js"></script>
    <script type="text/javascript" src="js/enfermagem.js"></script>
    <script type="text/javascript" src="js/mqtt-enfermagem.js"></script>

    <link rel="stylesheet" href="css/enfermagem.css">
</head>
<body style="background-color:#2f3947;">
  <p>ENFERMAGEM</p>
  <P>Unidade 3 - Resson&acirc;ncia Philips</P>
    <div class="container">
      <!-- <div id="subscriber" style="display: none;"></div>
      <div id="publisher" style="display: none;"></div>         -->
      <div id="subscriber"></div>
      <div id="publisher"></div> 
    </div>
    <div class="container">
      <i id="bSpeaker" style='font-size:120px;color:red;' class="fas fa-volume-mute" title="Ouvir command center" onclick="clickSpeaker()"> </i>
    </div>
    <br><br>
    <div class="container">
      <i id="bMic" style='font-size:120px;color:white;' class="fas fa-microphone" title="Falar com command center"> </i>
    </div>
    <BR>
    <div class="container">
      <p style='font-size:x-large;'id="txtCommandCenter">[MENSAGENS DO COMMAND CENTER]</p>
    </div>
    <audio id="incoming-command">
      <source src="sounds/pristine.mp3" type="audio/mpeg">
    </audio>
    
</body>
</html>
