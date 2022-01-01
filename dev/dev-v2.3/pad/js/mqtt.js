let host = "mqtt.gausstech.io";
let port = 9001;
let topic = 'cetam/#';
let useTLS = true;
let cleansession = true;
let reconnectTimeout = 1500;
let tempData = new Array();
let mqtt;
let connected = false;

function MQTTconnect() {
    //var status = document.getElementById("status");
    if (typeof path == "undefined") {
        path = '/';
    }
    mqtt = new Paho.MQTT.Client(host, port, path, "");
    let options = {
        timeout: 3,
        useSSL: useTLS,
        userName : "mqtt-gauss",
        password : "Spock1701a!",
        cleanSession: cleansession,
        onSuccess: onConnect,
        onFailure: function (message) {
            console.log("Connection failed");
            console.log(message);
            //status.innerHTML = "<b>Status:</b> Erro." ;
            setTimeout(MQTTconnect, reconnectTimeout);
        }
    };

    //status.innerHTML = "<b>Status:</b> Conectado." ;

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    console.log("Host: " + host + ", Port: " + port + ", Path: " + path + " TLS: " + useTLS);
    mqtt.connect(options);
};

function onConnect() {
    console.log("Connected to " + host + ":" + port);
    mqtt.subscribe(topic, { qos: 1 });
    connected = true;
};

function onConnectionLost(response) {
    //var status = document.getElementById("status");

    setTimeout(MQTTconnect, reconnectTimeout);
    //status.innerHTML = "Conection lost.";
    console.log("Connection lost.");
};

function onMessageArrived(message) {
    let topic = message.destinationName;
    let payload = message.payloadString;
    console.log("Topic: " + topic + ", Message payload: " + payload);
    let topics = topic.split('/');
    let area = topics[1];
    console.log(area);
    if(area == 'intercom'){
      console.log("Comando do intercom chegando");
    }
    if(area == 'enfermagem'){
      console.log("Comando da enfermagem chegando");
    }
};

function sendMessage(topic, message){
  msg = new Paho.MQTT.Message(message);
  msg.destinationName = topic;
  mqtt.send(msg);
}

function subscribeMQTT(the_topic){
    mqtt.subscribe(the_topic, { qos: 0 });
    var topico = document.getElementById("topico");
    topico.innerHTML = 'Topico: ' + the_topic;
    console.log("New topic subscribed: " + the_topic);

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
