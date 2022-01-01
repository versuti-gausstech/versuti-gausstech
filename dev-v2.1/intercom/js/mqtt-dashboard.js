let host = "mqtt.gausstech.io";
let port = 9001;
var client_name = 'cetam';

// let topic = client_name + '/intercom/b827ebd97628/#';
let stats_topic = client_name + '/intercom/stats/#';
let useTLS = true;
let cleansession = true;
let reconnectTimeout = 1000;
let tempData = new Array();
let mqtt;
let connected = false;

var mqtt_api = "https://api.gausstech.io:9091/";
var opentok_api = "https://api.gausstech.io:9090/";
var apiKey = "47173734";
let session_id = "";
let my_token = "";

function getRequest(url) {
  fetch(url, { mode: 'no-cors' }).then(function (response) {
    return response.json();
  }).then(function (data) {
    //console.log(data);
  }).catch(function () {
  });
}

function MQTTconnect() {
  if (typeof path == "undefined") {
    path = '/';
  }
  let my_id = getCookie("my_id");
  var client_id;
  if (my_id != "") {
    // gera um client_id com o MAC address do intercom
    client_id = "intercom-" + getCookie("my_id");
  } else {
    // gera um numero aleatorio para identificar este controlador, acessado via mqtt.html
    let random_id = Math.floor(Math.random() * 1000);
    client_id = "controlador-mqtt-" + random_id.toString();
  }

  mqtt = new Paho.MQTT.Client(host, port, path, client_id);
  let options = {
    timeout: 3,
    useSSL: useTLS,
    cleanSession: cleansession,
    onSuccess: onConnect,
    userName: "mqtt-gauss",
    password: "Spock1701a!",
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
  var my_id = getCookie("my_id");
  var topic = client_name + '/intercom/#';
  mqtt.subscribe(topic, { qos: 0 });

  var commandcenter_topic = client_name + '/commandcenter/#';
  mqtt.subscribe(commandcenter_topic, { qos: 0 });

  var enfermagem_topic = client_name + '/enfermagem/#';
  mqtt.subscribe(enfermagem_topic, { qos: 0 });

  console.log("Aguardando comandos de audio do controlador. ID : " + getCookie("my_id"));
  connected = true;
};

function onConnectionLost(response) {
  setTimeout(MQTTconnect, reconnectTimeout);
  console.log("Connection lost.");
  console.log(response);
  // url = mqtt_api + "offline/" + getCookie("my_id") + "/";
  // console.log(getRequest(url));
};

function onMessageArrived(message) {
  let topic = message.destinationName;
  let payload = message.payloadString;

  // exemplos de topico da mensagem : 
  //  topico : cetam/intercom/b827ebd97628/stats mensagem: ""
  //  topico : cetam/intercom/b827ebd97628/audio mensagem: JSON
  //
  let topic_items = topic.split('/');
  let cliente = topic_items[0];
  let tipo = topic_items[1];
  let id = topic_items[2];
  let comando = topic_items[3];
  let my_id = getCookie("my_id");

  //console.log("MESSAGE ARRIVED. Cliente : " + cliente + " | tipo: " + tipo + " | comando : " + comando + " | payload : " + payload);

  if (id == "stats") {
    stats = JSON.parse(payload)
    cpuTmp = document.getElementById("cpuTemp_" + stats.id);
    thermoCPU = document.getElementById("thermometer_" + stats.id);
    ramUsed = document.getElementById("ramUsed_" + stats.id);

    if (cpuTmp) {
      usedRAM = Math.round((stats.ram.used / stats.ram.total) * 100);
      cpuTmp.innerHTML = "CPU: " + stats.cpu.temp + "&#176;";
      ramUsed.innerHTML = "RAM (usada): " + usedRAM.toString() + "%";
      if (thermoCPU) {
        if (parseFloat(stats.cpu.temp) <= 60) {
          thermoCPU.style.color = "green";
        }
        if (parseFloat(stats.cpu.temp) > 60) {
          thermoCPU.style.color = "orange";
        }
        if (parseFloat(stats.cpu.temp) >= 75) {
          thermoCPU.style.color = "red";
        }
      }
    }
  }
  if (comando == "heartbeat") {
    // chegou um pedido ou entrega de heartbeat
    if (payload == "heartbeat") {
      // chegou um heartbeat
      mac_address = id; // pega o mac address de quem enviou o heartbeat
      status_mqtt = "statusMQTT_" + mac_address;
      mqtt_icon = document.getElementById(status_mqtt);
      if (mqtt_icon) {
        mqtt_icon.style.color = "green";
      }
    }
  }
  if(comando == "connect"){
    endpoint_id = id;
    //console.log("Endpoint conectado: " + id);
    connected_audio = document.getElementById("endpoint_" + endpoint_id);
    if(payload == 'online'){
      connected_audio.innerHTML = "ON";
    }else{
      connected_audio.innerHTML = "OFF";
    }
  }
};

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


function sendMessage(topic, message) {
  msg = new Paho.MQTT.Message(message);
  msg.destinationName = topic;
  mqtt.send(msg);
}

function subscribeMQTT(the_topic) {
  mqtt.subscribe(the_topic, { qos: 0 });
  console.log("Subscribed: " + the_topic);
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// a funcao micSwitch abre o SPEAKER no intercom e o MIC local para comunicacao
function micSwitch(client, type, id){
  console.log(id);
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
  topic_commandcenter = 'cetam/commandcenter/cc-1/audio';
  
  if(mic_icon.classList.value == "bi bi-mic-mute-fill"){
    console.log("Abrindo speaker de " + label);
    mic_icon.classList.value = "bi bi-mic-fill";
    mic_icon.style.color = "blue";
    command_audio = {'type' : 'speaker', 'command' : 'on', 'message' : 'ligar'};
    console.log("Abrindo microfone do local");
    command_commandcenter = {'type' : 'mic', 'command' : 'on', 'message' : label};

  }else{
    console.log("Fechando speaker de " + label);
    mic_icon.classList.value = "bi bi-mic-mute-fill";
    mic_icon.style.color = "red";
    command_audio = {'type' : 'speaker', 'command' : 'off', 'message' : 'desligar'};
    console.log("Fechando microfone local");
    command_commandcenter = {'type' : 'mic', 'command' : 'off', 'message' : label};
  }
  sendJSONMessage(topic_audio, command_audio);
  sendJSONMessage(topic_commandcenter, command_commandcenter);
}


// a funcao speakerSwitch abre o MIC no intercom e o SPEAKER local para comunicacao
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

  if(speaker_icon.style.color == "red"){
    console.log("Abrindo microfone de " + label);
    speaker_icon.style.color = "blue";
    command_audio = {'type' : 'mic', 'command' : 'on', 'message' : 'ligar'};
    console.log("Abrindo speaker local");
    command_commandcenter = {'type' : 'speaker', 'command' : 'on', 'message' : label};
  }else{
    speaker_icon.style.color = "red";
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

function buscaClientes() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

$(document).ready(function () {
  MQTTconnect();
});