var json = {};
    $.ajax({
        url: "json/estacao.json",
        async: false,
        dataType: 'json',
        success: function(data) {
            json = data;
        }
    });

//IP do robo intercom : DEV    
// const urlIntercomButton = ["http://" + json.tela_1.ip_pad_intercom + ":5000/",
//                         "http://" + json.tela_2.ip_pad_intercom + ":5000/",
//                         "https://100.94.172.9:5000/"];

// IP do robo intercom : PROD
const urlIntercomButton = ["http://ip:5000/",
                        "http://ip:5000/",
                        "https://192.168.1.153:5000/"];

let my_topic = 'cetam/intercom/0xb827eb3da438';

function getRequest(url){
  fetch(url, {mode: 'no-cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function() {
    });
}

function muteSpeaker(tipo, unidade){
  //buttonName = "mutar" + unidade;
  if(tipo == 'intercom'){
    buttonName = "mutar_intercom" + unidade;
  }else if(tipo == 'enfermagem'){
    buttonName = "mutar_enfermagem" + unidade;
  }
  var muteButton = document.getElementById(buttonName);  
  if(muteButton.className == "fas fa-volume-up"){
    muteButton.className = "fas fa-volume-mute";
    muteButton.style = "font-size:50px;color:white;";
    
    muteButton.title = "Audio mutado";
    console.log("Mutado Unidade " + unidade);
    
    if(tipo == 'intercom'){
      url = "https://cetam.gausstech.io:5000/mic/intercom/unidade-3/off/";
      getRequest(url);
    }else if(tipo == 'enfermagem'){
      url = "https://cetam.gausstech.io:5000/mic/enfermagem/unidade-3/off/";
      getRequest(url);
    }

  }else{
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";
        
    if(tipo == 'intercom'){
      url = "https://cetam.gausstech.io:5000/mic/intercom/unidade-3/on/";
      getRequest(url);
    }else if(tipo == 'enfermagem'){
      url = "https://cetam.gausstech.io:5000/mic/enfermagem/unidade-3/on/";
      getRequest(url);
    }

    muteButton.title = "Audio ligado";
    console.log("Desmutado Unidade " + unidade);
  }
}

function cameraPaciente(unidade){
  var camera = document.getElementById("camera");
  var btnCameraPaciente = document.getElementById("btnCameraPaciente");
  var btnCameraSala = document.getElementById("btnCameraSala");
  btnCameraPaciente.style = "cursor:pointer;font-size:35px;color:Blue;";
  btnCameraSala.style = "cursor:pointer;font-size:35px;color:Grey;";
  if(unidade == 1){
    //camera.src = "http://admin:ncc1701a@186.193.207.158:9003/stream/video/mjpeg";
    camera.src = "http://admin:ncc1701a@" + json.tela_1.ip_camera_paciente + "/stream/video/mjpeg";
  }
  if(unidade == 2){
    //camera.src = "http://admin:ncc1701a@186.193.207.158:9003/stream/video/mjpeg";
    camera.src = "http://admin:ncc1701a@" + json.tela_2.ip_camera_paciente + "/stream/video/mjpeg";
  }
  if(unidade == 3){
    //camera.src = "http://admin:ncc1701a@186.193.207.158:9007/stream/video/mjpeg";
    camera.src = "http://admin:ncc1701a@" + json.tela_3.ip_camera_paciente + "/stream/video/mjpeg";
  }
  
}

function cameraSala(unidade){
  var camera = document.getElementById("camera");
  var btnCameraPaciente = document.getElementById("btnCameraPaciente");
  var btnCameraSala = document.getElementById("btnCameraSala");
  btnCameraSala.style = "cursor:pointer;font-size:35px;color:Blue;";
  btnCameraPaciente.style = "cursor:pointer;font-size:35px;color:Grey;";
  if(unidade == 1){
    //camera.src = "http://admin:ncc1701a@186.193.207.158:9005/stream/video/mjpeg";
    camera.src = "http://admin:ncc1701a@" + json.tela_1.ip_camera_sala + "/stream/video/mjpeg";
  }
  if(unidade == 2){
    //camera.src = "http://admin:ncc1701a@186.193.207.158:9005/stream/video/mjpeg";
    camera.src = "http://admin:ncc1701a@" + json.tela_2.ip_camera_sala + "/stream/video/mjpeg";
  }
  if(unidade == 3){
    //camera.src = "http://admin:ncc1701a@186.193.207.158:9009/stream/video/mjpeg";
    camera.src = "http://admin:ncc1701a@" + json.tela_3.ip_camera_sala + "/stream/video/mjpeg";
  }
}


function audioIntercom(unidade) {
  // Get the checkbox
  chkName = "chkIntercom" + unidade;
  var checkBox = document.getElementById(chkName);
  // Get the output text
  var text = document.getElementById("txtStatus");

  // se o checkbox estiver checked, falar com o paciente
  if (checkBox.checked == true){
    text.style.display = "block";
    text.innerHTML = "Intercom " + unidade + ": paciente ouvindo.";
    micPaciente = "micPaciente" + unidade;
    document.getElementById(micPaciente).style.color = "Green";
    if(unidade == 1){
    }
    if(unidade == 2){
    }
    if(unidade == 3){
      url = "https://cetam.gausstech.io:5000/speaker/intercom/unidade-3/on/";
      getRequest(url);
      

      url = "https://cetam.gausstech.io:5000/mic/intercom/unidade-3/on/";
      getRequest(url);

      url = urlIntercomButton[2] + "philips/on";
      getRequest(url);
      //sendMessage(my_topic, "ON");
      console.log("Apertando botao..");
    }

    buttonName = "mutar_intercom" + unidade;
    var muteButton = document.getElementById(buttonName);  
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";

    console.log("Speaker on");

  } else {
    document.getElementById(micPaciente).style.color = "white";
    text.style.display = "none";
    if(unidade == 1){
    }
    if(unidade == 2){
    }
    if(unidade == 3){
      url = "https://cetam.gausstech.io:5000/speaker/intercom/unidade-3/off/";
      getRequest(url);

      url = urlIntercomButton[2] + "philips/off";
      getRequest(url);
      //sendMessage(my_topic, "OFF");
    }
    buttonName = "mutar_intercom" + unidade;
    var muteButton = document.getElementById(buttonName);  
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";
  }
}

function audioEnfermagem(unidade) {
  // Get the checkbox
  chkName = "chkEnfermagem" + unidade;
  var checkBox = document.getElementById(chkName);
  // Get the output text
  var text = document.getElementById("txtStatus");
  buttonName = "mutar_enfermagem" + unidade;
  var muteButton = document.getElementById(buttonName);  
  
  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text.style.display = "block";
    text.innerHTML = "Intercom " + unidade + ": enfermagem ouvindo.";
    micEnfermagem = "micEnfermagem"  + unidade;
    document.getElementById(micEnfermagem).style.color = "Green";

    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";
    console.log("Falar com Enfermagem");

    if(unidade == 1){
    }
    if(unidade == 2){
    }
    if(unidade == 3){
      url = "https://cetam.gausstech.io:5000/speaker/enfermagem/unidade-3/on/";
      getRequest(url);

      url = "https://cetam.gausstech.io:5000/mic/enfermagem/unidade-3/on/";
      getRequest(url);
    }

    buttonName = "mutar_enfermagem" + unidade;
    var muteButton = document.getElementById(buttonName);  
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";

  } else {
    text.innerHTML = "";
    micEnfermagem = "micEnfermagem" + unidade;
    document.getElementById(micEnfermagem).style.color = "white";

    if(unidade == 1){
    }
    if(unidade == 2){
    }
    if(unidade == 3){
      url = "https://cetam.gausstech.io:5000/speaker/enfermagem/unidade-3/off/";
      getRequest(url);
    }
    buttonName = "mutar_enfermagem" + unidade;
    var muteButton = document.getElementById(buttonName);  
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";
  }
}

function sendMessage(from, to, message){
  url = "https://cetam.gausstech.io:5000/message/" + from + "/" + to + "/" + message + "/";
  getRequest(url);
}

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
        sendMessage('Command Center', 'unidade-' + unidade, comando);
      }else{
        botao.style.backgroundColor = 'cadetblue';
        text.innerHTML = "";
        sendMessage('Command Center', 'unidade-' + unidade, "clear");
      }
    }
  });
}
