var json = {};
    $.ajax({
        url: "json/estacao.json",
        async: false,
        dataType: 'json',
        success: function(data) {
            json = data;
        }
    });


let my_topic = 'cetam/intercom/0xb827eb3da438';
//let enfermagem_topic = 'cetam/enfermagem/0xb827eb3da438';

function getRequest(url){
  fetch(url, {mode: 'no-cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function() {
    });
}

function muteSpeaker(tipo, id){
  //btnMuteIntercom = "mutar" + unidade;
  if(tipo == 'intercom'){
    buttonName = "speakerIntercom_" + id;
  }else if(tipo == 'enfermagem'){
    buttonName = "speakerEnfermagem_" + id;
  }
  var muteButton = document.getElementById(buttonName);  
  if(muteButton.className == "fas fa-volume-up"){
    speakerSwitch('cetam', tipo, id);

    muteButton.className = "fas fa-volume-mute";
    muteButton.style = "font-size:50px;color:white;";
    
    muteButton.title = "Audio mutado";
    console.log("Mutado Unidade " + id);
  }else{
    speakerSwitch('cetam', tipo, id);

    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:green;";
    muteButton.title = "Audio ligado";
    console.log("Desmutado Unidade " + id);
  }

}

function audioIntercom(mac) {
  var chkIntercomButtonTag = "chkIntercom_" + mac;
  var micPaciente = "micIntercom_" + mac;
  var btnMuteIntercom = "speakerIntercom_" + mac;

  var chkEnfermagemName = "chkEnfermagem_" + mac;
  var chkEnfermagemButton = document.getElementById(chkEnfermagemName);

  var chkIntercomButton = document.getElementById(chkIntercomButtonTag);
  var micIcon = document.getElementById(micPaciente);
  var muteButton = document.getElementById(btnMuteIntercom);  

  var text = document.getElementById("txtStatus");

  // se o checkbox estiver checked, falar com o paciente
  if (chkIntercomButton.checked == true){
    sendMessage('cetam/intercom/' + mac, 'ON');
    micSwitch('cetam', 'intercom', mac);
    //speakerSwitch('cetam', 'intercom', mac);
  }else{
    sendMessage('cetam/intercom/' + mac, 'OFF');
    speakerSwitch('cetam', 'intercom', mac);
    // micSwitch('cetam', 'intercom', mac);
    // speakerSwitch('cetam', 'intercom', mac);
  }



  if (chkEnfermagemButton.checked == true){
    //sendMessage('cetam/intercom/' + mac, 'ON');
    micSwitch('cetam', 'intercom', mac);
    speakerSwitch('cetam', 'intercom', mac);
  }else{
    //sendMessage('cetam/intercom/' + mac, 'OFF');
    micSwitch('cetam', 'intercom', mac);
    // speakerSwitch('cetam', 'intercom', mac);
  }

}


function audioEnfermagem(id) {
  // Get the checkbox
  chkName = "chkEnfermagem_" + id;
  var checkBox = document.getElementById(chkName);
  // Get the output text
  var text = document.getElementById("txtStatus");
  buttonName = "speakerEnfermagem_" + id;
  var muteButton = document.getElementById(buttonName);  

  micEnfermagem = "micEnfermagem_"  + id;
  speakerEnfermagem = "speakerEnfermagem_" + id;

  micIcon = document.getElementById(micEnfermagem);
  speakerIcon = document.getElementById(speakerEnfermagem);

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    micSwitch('cetam', 'enfermagem', id);
    speakerSwitch('cetam', 'enfermagem', id);

    text.style.display = "block";
    text.innerHTML = "Intercom " + id + ": enfermagem ouvindo.";

    micIcon.style.color = "green";

    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:green;";
    console.log("Falar com Enfermagem");

    buttonName = "speakerEnfermagem_" + id;
    var muteButton = document.getElementById(buttonName);  
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:green;";

  } else {
    micSwitch('cetam', 'enfermagem', id);
    //speakerSwitch('cetam', 'enfermagem', id);
    // buttonName = "speakerEnfermagem_" + id;
    // var muteButton = document.getElementById(buttonName);  
    speakerIcon.className = "fas fa-volume-up";
    speakerIcon.style = "font-size:50px;color:green;";
  }
}

function chamarEnfermagem(){
  let my_topic = 'cetam/enfermagem/0xb827eb3da438';
  sendMessage(my_topic, "call");
}

// function sendMessage(from, to, message){
//   url = "https://cetam.gausstech.io:5000/message/" + from + "/" + to + "/" + message + "/";
//   getRequest(url);
// }

function comandoBotao(comando, unidade){
  console.log(comando + " : unidade " + unidade);
  var text = document.getElementById("txtStatus");
  
  var comandos = ['injetar contraste', 'posicionar paciente', 'trocar bobina', 'intercorrencia', 'emergencia'];
  var botoes = {'injetar contraste' : 'ic', 'posicionar paciente' : 'pp', 'trocar bobina' : 'tb', 'intercorrencia' : 'int', 'emergencia' : 'em'};
  comandos.forEach(function(item,index){
    if(comando == item){
      var botao = document.getElementById(botoes[item] + unidade);
      if(botao.style.backgroundColor == 'cadetblue'){
        botao.style.backgroundColor = 'red';
        text.style.display = "block";
        text.innerHTML = comando + " : unidade " + unidade;
        //sendMessage('Command Center', 'unidade-' + unidade, comando);
        setVideo(true);
        //sendMessage('cetam/intercom/')

      }else{
        botao.style.backgroundColor = 'cadetblue';
        text.innerHTML = "";
        sendMessage('Command Center', 'unidade-' + unidade, "clear");
        setVideo(false);
      }
    }
  });
}
