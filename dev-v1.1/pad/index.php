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

?>

<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
  <link rel="stylesheet" href="css/botoes.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
  <script type="text/javascript" src="js/botoes.js"></script>
  <script type="text/javascript" src="js/mqtt.js"></script>

</head>

<body style="background-color:#2f3947;">
  <div class="sidenav">
    <a href="intercom.html" style='font-size:50px;'><i class="fas fa-desktop" title="Home"></i></a>
    <a href="config.php" style='font-size:50px;'><i class="fas fa-cog" title="Configurar"></i></a>
    <a href="../../logout.php" style='font-size:50px;'><i class="fas fa-sign-out-alt" title="Sair"></i></a>
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
          <tr>
            <td style="text-align: center; vertical-align: middle;">
              <div>
                <label class="switch">
                  <input type="checkbox" id="chkIntercom3" onclick="audioIntercom(3)">
                  <span class="slider round"></span>
                </label>
              </div>
            </td>
            <td style="text-align: center; vertical-align: middle;">
              <i id="micPaciente3" style='font-size:50px;color:white;' class="fas fa-microphone"></i>
              <i id="bellPaciente3" style='font-size:50px;color:white;' class="fas fa-bell" title="Paciente Chamando"> </i>
              <i id="mutar_intercom3" style='font-size:50px;color:white;' title="Audio do intercom mutado" class="fas fa-volume-mute" onclick="muteSpeaker('intercom',3)"></i>
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
                  <input type="checkbox" id="chkEnfermagem3" onclick="audioEnfermagem(3)">
                  <span class="slider round"></span>
                </label>
              </div>
            </td>
            <td style="text-align: center; vertical-align: middle;">
              <i id="micEnfermagem3" style='font-size:50px;color:white;' class="fas fa-microphone"></i>
              <i id="bellEnfermagem3" style='font-size:50px;color:white;' class="fas fa-bell" title="Enfermagem Chamando"> </i>
              <i id="mutar_enfermagem3" style='font-size:50px;color:white;' title="Audio da enfermagem mutado" class="fas fa-volume-mute" onclick="muteSpeaker('enfermagem',3)"></i>
              <i id="chamar_enfermagem3" style='font-size:50px;color:white;' title="Chamar enfermagem" class="fas fa-user-nurse" onclick="chamarEnfermagem()"></i>
            </td>
          </tr>
          <!-- <tr>
            <td></td>
            <td style="text-align: center; vertical-align: middle;">
              <i id="mutar3" style='font-size:50px;color:white;' title="Audio mutado" class="fas fa-volume-mute" onclick="muteSpeaker(3)"></i>
            </td>
          </tr> -->
    
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
</body>
<script>
  if(getCookie("screen_1") != -1){
    tela_1 = true;
  }else{
    tela_1 = false;
  }

  if(getCookie("screen_2") != -1){
    tela_2 = true;
  }else{
    tela_2 = false;
  }

  if(getCookie("screen_3") != -1){
    tela_3 = true;
  }else{
    tela_3 = false;
  }

  console.log("loading json file...");
  var response = $.getJSON("json/estacao.json", function(json) {

  //if(json.tela_1.enabled == "true") {  tela_1 = true ; }else{ tela_1 = false};
  //if(json.tela_2.enabled == "true") {  tela_2 = true ; }else{ tela_2 = false};
  //if(json.tela_3.enabled == "true") {  tela_3 = true ; }else{ tela_3 = false};

  div_tela_1 = document.getElementById("div_tela_1");
  div_tela_2 = document.getElementById("div_tela_2");
  div_tela_3 = document.getElementById("div_tela_3");
  div_central = document.getElementById("div_central");

  botoes_tela_1 = document.getElementById("button_container1");
  botoes_tela_2 = document.getElementById("button_container2");
  botoes_tela_3 = document.getElementById("button_container3");

  nome_unidade_1 = document.getElementById("nome_unidade_1");
  nome_unidade_2 = document.getElementById("nome_unidade_2");
  nome_unidade_3 = document.getElementById("nome_unidade_3");

  // nome_unidade_1.innerHTML = json.tela_1.nome_host;
  // nome_unidade_2.innerHTML = json.tela_2.nome_host;
  // nome_unidade_3.innerHTML = json.tela_3.nome_host;

  nome_unidade_1.innerHTML = getCookie("screen_1_marca") + " " + getCookie("screen_1_localizacao");
  nome_unidade_2.innerHTML = getCookie("screen_2_marca") + " " + getCookie("screen_2_localizacao");
  nome_unidade_3.innerHTML = getCookie("screen_3_marca") + " " + getCookie("screen_3_localizacao");

  screen1_intercom = getCookie("screen_1_intercom");
  screen2_intercom = getCookie("screen_2_intercom");
  screen3_intercom = getCookie("screen_3_intercom");

  if(tela_1){
    console.log("Tela 1 enabled");
    div_tela_1.style.visibility = "";
    botoes_tela_1.style.visibility = "";

  }else{
    console.log("Tela 1 disabled");
    div_tela_1.remove();
    botoes_tela_1.remove();
  }

  if(tela_2){
    console.log("Tela 2 enabled");
    div_tela_2.style.visibility = "";
    botoes_tela_2.style.visibility = "";
  }else{
    console.log("Tela 2 disabled");
    div_tela_2.remove();
    botoes_tela_2.remove();
  }

  if(tela_3){
    console.log("Tela 3 enabled");
    div_tela_3.style.visibility = "";
    botoes_tela_3.style.visibility = "";
  }else{
    console.log("Tela 3 disabled");
    div_tela_3.remove();
    botoes_tela_3.remove();
  }

  if(tela_1 && tela_2 && tela_3){
    console.log("Todas as telas enabled.");

    div_tela_1.style.width = "33%";
    botoes_tela_1.style.width = "33%";

    div_tela_2.style.width = "33%";
    botoes_tela_2.style.width = "33%";

    div_tela_3.style.width = "33%";
    botoes_tela_3.style.width = "33%";
  }
  if(tela_1 && tela_2 && (! tela_3)){
    console.log("Telas 1 e 2 enabled.");

    div_tela_1.style.width = "48%";
    botoes_tela_1.style.width = "50%";

    div_tela_2.style.width = "48%";
    botoes_tela_2.style.width = "50%";

  }
  if(tela_1 && !tela_2 && tela_3){
    console.log("Telas 1 e 3 enabled.");

    div_tela_1.style.width = "45%";
    botoes_tela_1.style.width = "45%";

    div_tela_3.style.width = "45%";
    botoes_tela_3.style.width = "45%";
  }
  if(!tela_1 && tela_2 && tela_3){
    console.log("Telas 2 e 3 enabled.");

    div_tela_2.style.width = "48%";
    botoes_tela_2.style.width = "50%";

    div_tela_3.style.width = "48%";
    botoes_tela_3.style.width = "50%";
  }

  if(tela_1 && !tela_2 && !tela_3){
    console.log("Tela 1 enabled.");
    div_central.style.width = "100%";
    div_tela_1.style.width = "60%";
    
    botoes_tela_1.style.width = "40%";
  }

  if(!tela_1 && tela_2 && !tela_3){
    console.log("Tela 2 enabled.");
    div_tela_2.style.width = "60%";
    botoes_tela_2.style.width = "60%";
  }

  if(!tela_1 && !tela_2 && tela_3){
    console.log("Tela 3 enabled.");
    div_tela_3.style.width = "60%";
    botoes_tela_3.style.width = "60%";
  }
});
</script>
</html>
