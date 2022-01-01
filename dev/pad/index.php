<!DOCTYPE html>
<?php
session_start();

//error_reporting(E_ALL);
error_reporting(0); 

ini_set('display_errors', 'On');

// se o usuario nao estiver logado, volta pra pagina de logar
if (!isset($_SESSION['loggedin'])) {
	header('Location: ../../index.html');
	exit;
}
$my_id = $_GET["id"];
setcookie("my_id", $my_id);
?>

<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
  <link rel="stylesheet" href="css/botoes.css">
  <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
  <script type="text/javascript" src="js/config.js"></script>
  <script type="text/javascript" src="js/botoes.js"></script>
  <script type="text/javascript" src="js/mqtt-pad.js"></script>
  <script type="text/javascript" src="js/command.js"></script>
</head>

<body style="background-color:#2f3947;">
  <div class="sidenav">
    <!-- <a href="intercom.html" style='font-size:50px;'><i class="fas fa-desktop" title="Home"></i></a> -->
    <a href="#" style='font-size:50px;'><i class="fas fa-play-circle" title="Iniciar sessão de áudio" onclick="iniciar('b827eb3da438', 'enf-3', 'cc-1');"></i></a>
    <a href="#" style='font-size:50px;'><i class="fas fa-stop-circle" title="Parar sessão de áudio" onclick="stopIntercom('b827eb3da438');stopEnfermagem('enf-3');reloadCommandCenter('cc-1');"></i></a>

    <!-- <a href="#" style='font-size:50px;'><i class="fas fa-play-circle" title="Iniciar sessão de áudio" onclick="iniciar('b827ebd97628', 'enf-2', 'cc-1');"></i></a>
    <a href="#" style='font-size:50px;'><i class="fas fa-stop-circle" title="Parar sessão de áudio" onclick="stopIntercom('b827ebd97628');stopEnfermagem('enf-2');reloadCommandCenter('cc-1');"></i></a> -->

    <a href="../../logout.php" style='font-size:50px;'><i class="fas fa-sign-out-alt" title="Sair"></i></a>
    <div class="container" style="display: none;">
      <!-- <div id="subscriber" style="display: none;"></div>
      <div id="publisher" style="display: none;"></div>         -->
      <div id="subscriber"></div><br>
      <div id="publisher"></div> 
    </div>
  </div>
  <div class="main">
    <br>
    <div id="div_central" style="width: 100%; overflow: hidden;text-align: center; vertical-align: middle;color:white;">
      <div class="center" id="div_tela_1" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
      <b><label id="nome_unidade_1">UNIDADE 1 - PHILIPS</label></b>
      <br><br>
      <table style="width:100%;">
        <tr>
          <td style="text-align: center; vertical-align: middle;">Paciente</td>
          <td style="text-align: center; vertical-align: middle;">Audio</td>
        </tr>
        <tr>
          <td style="text-align: center; vertical-align: middle;">
            <div>
              <label class="switch">
                <input type="checkbox" id="chkIntercom1" onclick="audioIntercom(1)">
                <span class="slider round"></span>
              </label>
            </div>
          </td>
          <td style="text-align: center; vertical-align: middle;">
            <i id="micPaciente1" style='font-size:50px;color:white;' class="fas fa-microphone"></i>
            <i id="bellPaciente1" style='font-size:50px;color:white;' class="fas fa-bell" title="Paciente Chamando"> </i>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; vertical-align: middle;">Enfermagem</td>
          <td></td>
        </tr>
        <tr>
          <td style="text-align: center; vertical-align: middle;">
            <div>
              <label class="switch">
                <input type="checkbox" id="chkEnfermagem1" onclick="audioEnfermagem(1)">
                <span class="slider round"></span>
              </label>
            </div>
          </td>
          <td style="text-align: center; vertical-align: middle;">
            <i id="micEnfermagem1" style='font-size:50px;color:white;' class="fas fa-microphone"></i>
            <i id="bellEnfermagem1" style='font-size:50px;color:white;' class="fas fa-bell" title="Enfermagem Chamando"> </i>
          </td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: center; vertical-align: middle;">
            <i id="mutar1" style='font-size:50px;color:white;' title="Audio mutado" class="fas fa-volume-mute" onclick="muteSpeaker(1)"></i>
          </td>
        </tr>
  
      </table>

      </div>

      <div class="center" id="div_tela_2" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
        <b><label id="nome_unidade_2">UNIDADE 2 - GE</label></b>
        <br><br>
        <table style="width:100%;">
          <tr>
            <td style="text-align: center; vertical-align: middle;">Paciente</td>
            <td style="text-align: center; vertical-align: middle;">Audio</td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle;">
              <div>
                <label class="switch">
                  <input type="checkbox" id="chkIntercom2" onclick="audioIntercom(2)">
                  <span class="slider round"></span>
                </label>
              </div>
            </td>
            <td style="text-align: center; vertical-align: middle;">
              <i id="micPaciente2" style='font-size:50px;color:white;' class="fas fa-microphone"></i>
              <i id="bellPaciente2" style='font-size:50px;color:white;' class="fas fa-bell" title="Paciente Chamando"> </i>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle;">Enfermagem</td>
            <td></td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle;">
              <div>
                <label class="switch">
                  <input type="checkbox" id="chkEnfermagem2" onclick="audioEnfermagem(2)">
                  <span class="slider round"></span>
                </label>
              </div>
            </td>
            <td style="text-align: center; vertical-align: middle;">
              <i id="micEnfermagem2" style='font-size:50px;color:white;' class="fas fa-microphone"></i>
              <i id="bellEnfermagem2" style='font-size:50px;color:white;' class="fas fa-bell" title="Enfermagem Chamando"> </i>
            </td>
          </tr>
          <tr>
            <td></td>
            <td style="text-align: center; vertical-align: middle;">
              <i id="mutar2" style='font-size:50px;color:white;' title="Audio mutado" class="fas fa-volume-mute" onclick="muteSpeaker(2)"></i>
            </td>
          </tr>
    
        </table>
  
      </div>

      <div class="center" id="div_tela_3" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
        <b><label id="nome_unidade_3">UNIDADE 3 - PHILIPS</label></b>
        <br><br>
        <table style="width:100%;">
          <tr>
            <td style="text-align: center; vertical-align: middle;">Paciente</td>
            <td style="text-align: center; vertical-align: middle;">Audio</td>
          </tr>
          <tr id="rowPaciente_b827eb3da438">
            <td style="text-align: center; vertical-align: middle;">
              <div>
                <label id="botaoIntercom_b827eb3da438" class="switch">
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle;">Enfermagem</td>
            <td></td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle;">
              <div>
                <label class="switch">
                  <input type="checkbox" id="chkEnfermagem_b827eb3da438" onclick="audioEnfermagem('b827eb3da438')">
                  <span class="slider round"></span>
                </label>
              </div>
            </td>
            <td style="text-align: center; vertical-align: middle;">
              <i id="micEnfermagem_b827eb3da438" style='font-size:50px;color:white;padding: 3px;' class="fas fa-microphone"></i>
              <i id="speakerEnfermagem_b827eb3da438" style='font-size:50px;color:white;padding: 3px;' title="Audio da enfermagem mutado" class="fas fa-volume-mute" onclick="muteSpeaker('intercom','b827eb3da438')"></i>
              <i id="audioEnfermagem_b827eb3da438" style='font-size:50px;color:grey;padding: 3px;' title="Audio enfermagem offline" class="fas fa-user-nurse" onclick="chamarEnfermagem()"></i>
              <i id="bellEnfermagem_b827eb3da438" style='font-size:50px;color:white;padding: 3px;' class="fas fa-bell" title="Enfermagem Chamando"> </i>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div id="block_container" style="width: 100%; text-align: center; vertical-align: middle;color:white;">
      <div class="center" id="button_container1" style="width: 33%; color:white;border:0px solid rgb(150, 19, 19);">
        <div class="round-button">
          <div class="round-button-circle" style="background-color: cadetblue;" onclick="comandoBotao('injetar contraste',1);"><a href="#" class="round-button" title="Injetar contraste">IC</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" onclick="comandoBotao('pp', 1);"><a href="#" class="round-button" title="Posicionar paciente">PP</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" onclick="comandoBotao('tb', 1);"><a href="#" class="round-button" title="Trocar bobina">TB</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" style="background-color:coral;" onclick="comandoBotao('int', 1);"><a href="#" class="round-button" title="Intercorrencia">INT</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" style="background-color:red;" onclick="comandoBotao('emerg', 1);"><a href="#" class="round-button" title="Emergencia">E</a></div>
        </div>
      </div>

      <div class="center" id="button_container2" style="width: 33%; color:white;border:0px solid rgb(150, 19, 19);">
        <div class="round-button">
          <div class="round-button-circle" style="background-color: cadetblue;" onclick="comandoBotao('ic', 2);"><a href="#" class="round-button" title="Injetar contraste">IC</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" onclick="comandoBotao('pp', 2);"><a href="#" class="round-button" title="Posicionar paciente">PP</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" onclick="comandoBotao('tb', 2);"><a href="#" class="round-button" title="Trocar bobina">TB</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" style="background-color:coral;" onclick="comandoBotao('int', 2);"><a href="#" class="round-button" title="Intercorrencia">INT</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div class="round-button-circle" style="background-color:red;" onclick="comandoBotao('emerg', 2);"><a href="#" class="round-button" title="Emergencia">E</a></div>
        </div>
      </div>

      <div class="center" id="button_container3" style="width: 33%; color:white;border:0px solid rgb(150, 19, 19);">
        <div class="round-button">
          <div id="ic3" class="round-button-circle" style="background-color: cadetblue;" onclick="comandoBotao('injetar contraste', 3);"><a href="#" class="round-button" title="Injetar contraste">IC</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div id="pp3" class="round-button-circle" style="background-color: cadetblue;" onclick="comandoBotao('posicionar paciente', 3);"><a href="#" class="round-button" title="Posicionar paciente">PP</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div id="tb3" class="round-button-circle" style="background-color: cadetblue;" onclick="comandoBotao('trocar bobina', 3);"><a href="#" class="round-button" title="Trocar bobina">TB</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div id="int3" class="round-button-circle" style="background-color: cadetblue;" onclick="comandoBotao('intercorrencia', 3);"><a href="#" class="round-button" title="Intercorrencia">INT</a></div>
        </div>
        <div class="round-button" style="padding-left:30px;">          
          <div id="em3" class="round-button-circle" style="background-color:cadetblue;" onclick="comandoBotao('emergencia', 3);"><a href="#" class="round-button" title="Emergencia">E</a></div>
        </div>
      </div>
    </div>
    <br><br>
    <p id="txtIntercom" style="display:none;color:white;">Intercom : paciente ouvindo</p>
    <p id="txtEnfermagem" style="display:none;color:white;">Intercom : enfermagem ouvindo</p>
    <p id="txtStatus" style="display:none;color:white;">Status</p>
  </div>
  <!-- funcoes que tratam dos botoes e itens do frontend relacionados as telas -->
  <script type="text/javascript" src="js/screen.js"></script>

</body>
</html>
