var json = {};
    $.ajax({
        url: "json/estacao.json",
        async: false,
        dataType: 'json',
        success: function(data) {
            json = data;
        }
    });

var urlCommandPad = "http://" + json.ip_pad_command + ":7000/";
const urlIntercomPad = ["http://" + json.tela_1.ip_pad_intercom + ":7000/",
                        "http://" + json.tela_2.ip_pad_intercom + ":7000/",
                        "http://" + json.tela_3.ip_pad_intercom + ":7000/"];

const urlFreedom = "http://" + json.ip_freedom;

function getRequest(url){
  fetch(url, {mode: 'no-cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function() {
    });
}

function muteSpeaker(unidade){
  buttonName = "mutar" + unidade;
  //goFullScreen();
  var muteButton = document.getElementById(buttonName);  
  if(muteButton.className == "fas fa-volume-up"){
    muteButton.className = "fas fa-volume-mute";
    muteButton.style = "font-size:50px;color:white;";
    
    muteButton.title = "Audio mutado";
    console.log("Mutado Unidade " + unidade);
    unsubscribeIntercom();
    unsubscribeEnfermagem();

  }else{
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";
        
    subscribeIntercom();
    subscribeEnfermagem();
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
//      falarIntercom();
      url = "http://10.0.0.45:7000/speaker/intercom/unidade-3/on/";
      getRequest(url);
      subscribeIntercom();
    }

    buttonName = "mutar" + unidade;
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
      //naofalarIntercom();
      url = "http://10.0.0.45:7000/speaker/intercom/unidade-3/off/";
      getRequest(url);
    }
    buttonName = "mutar" + unidade;
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
  buttonName = "mutar" + unidade;
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
      falarEnfermagem();
      subscribeEnfermagem();
    }

    buttonName = "mutar" + unidade;
    var muteButton = document.getElementById(buttonName);  
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";

  } else {
    micEnfermagem = "micEnfermagem" + unidade;
    document.getElementById(micEnfermagem).style.color = "white";

    if(unidade == 1){
    }
    if(unidade == 2){
    }
    if(unidade == 3){
      naofalarEnfermagem();
    }
    buttonName = "mutar" + unidade;
    var muteButton = document.getElementById(buttonName);  
    muteButton.className = "fas fa-volume-up";
    muteButton.style = "font-size:50px;color:Green;";
  }
}

// function executeQuery() {
// theUrl = urlIntercomPad + "ring/status/paciente/"
// $.ajax({
//   url : theUrl,
//   success: function(data) {
//     // do something with the return value here if you like

//     if(data.status == "ring"){
//       console.log("Paciente chamando...");
//       $('#bellPaciente1').css('color', 'Red');
//     }else{
//       $('#bellPaciente1').css('color', 'white');
//     }
//   }
// });

// theUrl = urlIntercomPad + "ring/status/enfermagem/"
// $.ajax({
//   url: theUrl,
//   success: function(data) {
//       // do something with the return value here if you like
//     if(data.status == "ring"){
//       console.log("Enfermagem chamando...");
//       $('#bellEnfermagem1').css('color', 'Red');
//       var audio = new Audio('ring.mp3');
//       audio.play();
//     }else{
//       $('#bellEnfermagem1').css('color', 'white');
//     }
//   }
// });
// setTimeout(executeQuery, 1000); // you could choose not to continue on failure...
// }

// function goFullScreen(){
//   document.documentElement.webkitRequestFullScreen();
// }

function comandoBotao(comando, unidade){
  console.log(comando + " : unidade " + unidade);
}
