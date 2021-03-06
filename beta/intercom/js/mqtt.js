let host = "mqtt.gausstech.io";
let port = 9001;

let topic = 'cetam/intercom/b827ebd97628/#';
let useTLS = true;
let cleansession = true;
let reconnectTimeout = 1000;
let tempData = new Array();
let mqtt;
let connected = false;

var apiKey = "47173734";
let session_id = "";
let my_token = "";

function getRequest(url){
  fetch(url, {mode: 'no-cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function() {
    });
}

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
    var topic = "cetam/intercom/" + getCookie("my_id") + "/#";
    mqtt.subscribe(topic, { qos: 0 });
    console.log("Aguardando comandos de audio do controlador. ID : " + getCookie("my_id"));
    connected = true;
    console.log("Enviando heartbeat para o broker MQTT");
    url = "https://api.gausstech.io:9091/online/" + getCookie("my_id") + "/";
    console.log(getRequest(url));
};

function onConnectionLost(response) {
  url = "https://api.gausstech.io:9091/offline/" + getCookie("my_id") + "/";
  console.log(getRequest(url));
  setTimeout(MQTTconnect, reconnectTimeout);
  console.log("Connection lost.");
};

function onMessageArrived(message) {
    let topic = message.destinationName;
    let payload = message.payloadString;
    //console.log("Topic: " + topic + ", Message payload: " + payload);

    let topics = topic.split('/');
    let cliente = topics[0];
    let tipo = topics[1];
    let id = topics[2];
    let comando = topics[3];

    if(tipo == "intercom"){
      console.log("Chegou comando para o intercom : " + id);
      console.log("Comando: " + comando);
      if(comando == "refresh"){
        console.log("Refreshing page..");
        location.reload();
      }
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

window.addEventListener('beforeunload', function (e) {
  // the absence of a returnValue property on the event will guarantee the browser unload happens
  delete e['returnValue'];
  // my code that silently runs goes here
  url = "https://api.gausstech.io:9091/offline/" + getCookie("my_id") + "/"; 
  getRequest(url);
});

$(document).ready(function () {
    MQTTconnect();
});