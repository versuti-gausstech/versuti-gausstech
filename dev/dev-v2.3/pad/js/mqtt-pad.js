let mqtt;
let connected = false;

let useTLS = true;
let cleansession = true;
let reconnectTimeout = 1000;

function MQTTconnect() {
  if (typeof path == "undefined") {
      path = '/';
  }
  mqtt = new Paho.MQTT.Client(host, port, path, "");
  let options = {
      timeout: 3,
      useSSL: useTLS,
      cleanSession: cleansession,
      onSuccess: onConnect,
      userName : mqtt_user,
      password : mqtt_pwd,
      onFailure: function (message) {
          console.log("Connection failed");
          setTimeout(MQTTconnect, reconnectTimeout);
      }
  };

  mqtt.onConnectionLost = onConnectionLost;
  mqtt.onMessageArrived = onMessageArrived;
  console.log("Host: " + host + ", Port: " + port + ", Path: " + path + " TLS: " + useTLS);
  mqtt.connect(options);
};

function onConnect() {
  console.log("Connected to " + host + ":" + port)
  mqtt.subscribe(intercom_topic, { qos: 0 });
  console.log("Subscribed : " + intercom_topic);

  mqtt.subscribe(command_topic, { qos: 1 });
  console.log("Subscribed : " + command_topic);

  mqtt.subscribe(enfermagem_topic, { qos: 1 });
  console.log("Subscribed : " + enfermagem_topic);

  connected = true;
};

function onConnectionLost(response) {
  setTimeout(MQTTconnect, reconnectTimeout);
  console.log("Connection lost.");
};

function onMessageArrived(message) {
  let topic = message.destinationName;
  let payload = message.payloadString;
  //console.log("Topic: " + topic + ", Message payload: " + payload);

  let topics = topic.split('/');
  //let cliente = topics[0];
  let tipo = topics[1];
  let id = topics[2];
  let comando = topics[3];

  if(comando == "connect"){
    endpoint_id = id;
    console.log("Endpoint conectado: " + id);
    headsetIcon = document.getElementById("audioStatus_" + endpoint_id);
    nurseIcon = document.getElementById("audioEnfermagem_" + id);
    chkIntercom = document.getElementById('chkIntercom_' + endpoint_id);
    if(payload == 'online'){
      if(tipo == 'intercom'){
        headsetIcon.style.color = "green";
        chkIntercom.disabled = false;
      }
      if(tipo == 'enfermagem'){
        nurseIcon.style.color = "green";
        nurseIcon.title = 'Audio enfermagem online';
      }
    }else{
      if(tipo == 'intercom'){
        headsetIcon.style.color = "grey";
        nurseIcon.title = 'Audio enfermagem offline';
        chkIntercom.disabled = true;
      }
      if(tipo == 'enfermagem'){
        nurseIcon.style.color = "grey";
      } 
    }
  }  

  if(tipo == "intercom"){
    var micPaciente = "micIntercom_" + id;
    var btnMuteIntercom = "speakerIntercom_" + id;
    var chkIntercomButtonTag = "chkIntercom_" + id;

    var micIcon = document.getElementById(micPaciente);
    var muteButton = document.getElementById(btnMuteIntercom);  
    var chkIntercomButton = document.getElementById(chkIntercomButtonTag);

    var text = document.getElementById("txtStatus");

    if(payload == 'ON'){
      console.log("Botao apertado");
    }
    if(payload == 'OFF'){
      console.log("Botao solto");
      micSwitch('cetam', 'intercom', mac);

      micIcon.style.color = "white";
      muteButton.className = "fas fa-volume-up";
      muteButton.style = "font-size:50px;color:Green;";
      chkIntercomButton.checked = false;
      text.innerHTML = "";
    }  
  }

  if(tipo == "commandcenter"){
    console.log("Mensagem para o command center : " + id);
    console.log("Comando: " + comando);
    if(comando == "session"){
      console.log("Session ID recebido: " + payload);
      session_id = payload;
    }
    if(comando == "token"){
      console.log("Token recebido: " + payload);
      my_token = payload;
    }
    if(comando == "start"){
      console.log("Conectando audio do intercom..");
      initializeSession(apiKey, session_id, my_token);
    }
    if(comando == "stop"){
      console.log("Desconectando audio do intercom..");
      sessionDisconnect();
    }
    if(comando == "reload"){
      location.reload();
    }  
    if(comando == "audio"){
      json_command = JSON.parse(payload);
      if(json_command.message == "intercom"){
        if(json_command.type == "speaker"){
          setIntercomSpeaker(json_command.command);
        }
        if(json_command.type == "mic"){
          setCommandCenterMic(json_command.command);
        }
      }
      if(json_command.message == "enfermagem"){
        if(json_command.type == "speaker"){
          setEnfermagemSpeaker(json_command.command);
        }
        if(json_command.type == "mic"){
          setCommandCenterMic(json_command.command);
        }
      }
    }  
  }

};

// a funcao micSwitch abre o SPEAKER no intercom (ou enfermagem) e o MIC local para comunicacao
function micSwitch(client, type, id){
  console.log('MIC SWITCHING ----------: ' + id);
  if(type == 'intercom'){
    tag = 'micIntercom_';
    label = 'intercom';
  }
  if(type == 'enfermagem'){
    tag = 'micEnfermagem_';
    label = 'enfermagem';
  }

  mic_icon = document.getElementById(tag + id);
  topic_audio = client + '/' + type + '/' + id + '/audio';
  topic_commandcenter = client + '/commandcenter/cc-1/audio';
  
  if(mic_icon.style.color == "white"){
    console.log("Abrindo speaker de " + label);
    mic_icon.style.color = "green";
    command_audio = {'type' : 'speaker', 'command' : 'on', 'message' : 'ligar'};
    console.log("Abrindo microfone do local");
    command_commandcenter = {'type' : 'mic', 'command' : 'on', 'message' : label};
  }else{
    console.log("Fechando speaker de " + label);
    mic_icon.style.color = "white";
    command_audio = {'type' : 'speaker', 'command' : 'off', 'message' : 'desligar'};
    console.log("Fechando microfone local");
    command_commandcenter = {'type' : 'mic', 'command' : 'off', 'message' : label};
  }
  sendJSONMessage(topic_audio, command_audio);
  sendJSONMessage(topic_commandcenter, command_commandcenter);
}


// a funcao speakerSwitch abre o MIC no intercom (ou enfermagem) e o SPEAKER local para comunicacao
function speakerSwitch(client, type, id){
  console.log(id);
  if(type == 'intercom'){
    tag = 'speakerIntercom_';
    label = 'intercom';
  }
  if(type == 'enfermagem'){
    tag = 'speakerEnfermagem_';
    label = 'enfermagem'
  }

  speaker_icon = document.getElementById(tag + id);
  topic_audio = client + '/' + type + '/' + id + '/audio';
  topic_commandcenter = 'cetam/commandcenter/cc-1/audio';

  if(speaker_icon.style.color == "white"){
    console.log("Abrindo microfone de " + label);
    speaker_icon.style.color = "green";
    speaker_icon.className = "fas fa-volume-up";

    command_audio = {'type' : 'mic', 'command' : 'on', 'message' : 'ligar'};
    console.log("Abrindo speaker local");
    command_commandcenter = {'type' : 'speaker', 'command' : 'on', 'message' : label};
  }else{
    speaker_icon.style.color = "white";
    speaker_icon.className = "fas fa-volume-mute";
    command_audio = {'type' : 'mic', 'command' : 'off', 'message' : 'desligar'}; // microfone SEMPRE ABERTO no intercom
    console.log("Fechando speaker local");
    command_commandcenter = {'type' : 'speaker', 'command' : 'off', 'message' : label};
  }
  sendJSONMessage(topic_audio, command_audio);
  sendJSONMessage(topic_commandcenter, command_commandcenter);
}

function sendMessage(topic, message){
  msg = new Paho.MQTT.Message(message);
  msg.destinationName = topic;
  mqtt.send(msg);
}

function sendJSONMessage(topic, message){
  msg = new Paho.MQTT.Message(JSON.stringify(message));
  msg.destinationName = topic;
  mqtt.send(msg);
}


function subscribeMQTT(the_topic){
  mqtt.subscribe(the_topic, { qos: 0 });
  console.log("Subscribed: " + the_topic);
}


function iniciar(intercom_id, enfermagem_id, commandcenter_id){
  // cria sessao atraves da api.gausstech.io:9090/
  url = opentok_api + 'session/create/';
  session = getJSON(url);
  apiKey = session.apiKey;
  session_id = session.session_id;
  
  // cria token para o intercom
  label = 'intercom-' + intercom_id;
  url_intercom = opentok_api + 'token/create/' + session_id + '/' + label + '/';
  token_intercom = getJSON(url_intercom);
  
  // cria token para a enfermagem
  label = 'enfermagem-' + enfermagem_id;
  url_enfermagem = opentok_api + 'token/create/' + session_id + '/' + label + '/';
  token_enfermagem = getJSON(url_enfermagem);

  // cria token para o operador do command center
  url_commandcenter = opentok_api + 'token/create/' + session_id + '/CommandCenter-' + commandcenter_id + '/';
  token_commandcenter = getJSON(url_commandcenter);

  // url_dashboard = opentok_api + 'token/create/' + session_id + '/dashboard' + id + '/';
  // token_dashboard = getJSON(url_dashboard);

  var opentokData = { 'apiKey' : apiKey, 
                      'session_id' : session_id, 
                      'intercom' : token_intercom.token, 
                      'enfermagem' : token_enfermagem.token, 
                      'commandcenter' : token_commandcenter.token,
                      'dashboard' : ''
                    };

  initIntercom(intercom_id, opentokData);
  initEnfermagem(enfermagem_id, opentokData);        
  initCommandCenter(commandcenter_id, opentokData);
}

function initIntercom(id, opentokData) {
  apiKey = opentokData['apiKey'];
  session_id = opentokData['session_id'];
  token = opentokData['intercom'];
  token_dashboard = opentokData['dashboard'];

  topic = client_name + '/intercom/' + id;
  startAPI = topic + "/apikey";
  startSession = topic + "/session";
  startToken = topic + "/token";
  startUp = topic + "/start";

  sendMessage(startAPI, apiKey);
  sendMessage(startSession, session_id);
  sendMessage(startToken, token);
  sendMessage(startUp, "start");
}

function initEnfermagem(id, opentokData) {
  apiKey = opentokData['apiKey'];
  session_id = opentokData['session_id'];
  token = opentokData['enfermagem'];
  token_dashboard = opentokData['dashboard'];

  topic = client_name + '/enfermagem/' + id;
  startAPI = topic + "/apikey";
  startSession = topic + "/session";
  startToken = topic + "/token";
  startUp = topic + "/start";

  sendMessage(startAPI, apiKey);
  sendMessage(startSession, session_id);
  sendMessage(startToken, token);
  sendMessage(startUp, "start");
}

function initCommandCenter(id, opentokData) {
  apiKey = opentokData['apiKey'];
  session_id = opentokData['session_id'];
  token = opentokData['commandcenter'];
  token_dashboard = opentokData['dashboard'];

  commandcenter_topic = "cetam/commandcenter/" + id + "/";
  token_commandcenter = opentokData['commandcenter'];

  topic = client_name + '/commandcenter/' + id;
  startAPI = topic + "/apikey";
  startSession = topic + "/session";
  startToken = topic + "/token";
  startUp = topic + "/start";

  sendMessage(startSession, session_id);
  sendMessage(startToken, token_commandcenter);
  sendMessage(startUp, "start");

}


function stopIntercom(id) {
  topic = client_name + '/intercom/' + id + "/stop";
  //console.log(topic);
  sendMessage(topic, "");
}

function stopCommandCenter(id) {
  topic = client_name + '/commandcenter/' + id + "/stop";
  //console.log(topic);
  sendMessage(topic, "");
}

function stopEnfermagem(id) {
  topic = client_name + '/enfermagem/' + id + "/stop";
  //console.log(topic);
  sendMessage(topic, "");
}

function reloadIntercom(id) {
  topic = client_name + '/intercom/' + id + "/reload";
  //console.log(topic);
  sendMessage(topic, "");
}

function reloadCommandCenter(id) {
  topic = client_name + '/commandcenter/' + id + "/reload";
  //console.log(topic);
  sendMessage(topic, "");
}

function reloadEnfermagem(id) {
  topic = client_name + '/enfermagem/' + id + "/reload";
  //console.log(topic);
  sendMessage(topic, "");
}

function reloadIntercom(id) {
  topic = client_name + '/intercom/' + id + "/reload";
  console.log(topic);
  sendMessage(topic, "");
}
$(document).ready(function () {
  MQTTconnect();
});