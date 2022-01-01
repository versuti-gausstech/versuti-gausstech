let host = "mqtt.gausstech.io";
let port = 9001;

let topic = 'cetam/intercom/#';
let my_id = "cc-1"
let command_topic = 'cetam/commandcenter/' + my_id + "/#";
let useTLS = true;
let cleansession = true;
let reconnectTimeout = 1000;
let tempData = new Array();
let mqtt;
let connected = false;

var apiKey = "47173734";
let session_id = "";
let my_token = "";


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
      userName : "mqtt-gauss",
      password : "Spock1701a!",
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
  var topic = "cetam/intercom/#";
  mqtt.subscribe(topic, { qos: 0 });
  console.log("Subscribed : " + topic);

  mqtt.subscribe(command_topic, { qos: 1 });
  console.log("Subscribed : " + command_topic);
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
      sendMessage("cetam/commandcenter/" + my_id + "/connect", "online");
    }
    if(comando == "stop"){
      console.log("Desconectando audio do intercom..");
      sessionDisconnect();
    }
    if(comando == "reload"){
      sendMessage("cetam/commandcenter/" + my_id + "/connect", "offline");
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
  }  
  }
};

function sendMessage(topic, message){
  msg = new Paho.MQTT.Message(message);
  msg.destinationName = topic;
  mqtt.send(msg);
}

function subscribeMQTT(the_topic){
  mqtt.subscribe(the_topic, { qos: 0 });
  console.log("Subscribed: " + the_topic);
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
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

$(document).ready(function () {
  MQTTconnect();
});