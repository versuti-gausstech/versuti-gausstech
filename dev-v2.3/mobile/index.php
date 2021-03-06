<html>
<?php
session_start();

//error_reporting(E_ALL);
error_reporting(0); 

ini_set('display_errors', 'On');

$user_id = (isset($_SESSION['username']))?$_SESSION['username']:'';

// se o usuario nao estiver logado, volta pra pagina de logar
if (!isset($_SESSION['loggedin'])) {
	header('Location: ../../index.html');
	exit;
}

?>
<head>
    <title>CETAM - Command Center </title>
    <meta name= "viewport" content= "width = device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
    <script src="https://use.fontawesome.com/releases/v5.15.3/js/all.js"></script>
    <script type="text/javascript" src="js/mobile.js"></script>
    <link rel="stylesheet" href="css/mobile.css">
</head>
<body style="background-color:#2f3947;">
  <p>ENFERMAGEM</p>
  <P>CETAM UNIDADE SBO</P><br><br>
    <div class="container">
      <i id="bCommandCenter" style='font-size:100px;color:white;' class="fas fa-user-alt-slash" title="Command Center : sem chamados"> </i>
    </div>
    <P>COMMAND CENTER</P>
    <br>
    <div class="container">
      <i id="bReply" style='font-size:100px;color:white;' class="fas fa-reply" title="Atender chamado do Command Center" onclick="reply()"> </i>
    </div>
    <P>ESTOU A CAMINHO</P>
    <br>
    <div class="container">
      <i id="bArrived" style='font-size:100px;color:white;' class="fas fa-procedures" title="Avisar retorno a sala de operacoes" onclick="arrived()"> </i>
    </div>
    <P>ESTOU NA SALA</P>
    <br>
    <div class="container">
      <p style='font-size:x-large;'id="txtCommandCenter">[MENSAGENS DO COMMAND CENTER]</p>
    </div>
    <audio id="incoming-command">
      <source src="sounds/pristine.mp3" type="audio/mpeg" autoplay>
    </audio>
    <script type="text/javascript">
    var myvar='<?php echo $user_id;?>';
    setCookie('username', $user_id);
    console.log(myvar);
    </script>
</body>
</html>
