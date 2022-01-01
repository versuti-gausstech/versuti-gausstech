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
    var my_id = getCookie("my_id");
    if(my_id != ""){
      console.log("Enviando heartbeat para o broker MQTT");
      url = "https://api.gausstech.io:9091/online/" + my_id + "/";
      console.log(url);
      console.log(getRequest(url));
    }
};

function onConnectionLost(response) {
    setTimeout(MQTTconnect, reconnectTimeout);
    console.log("Connection lost.");
    url = "https://api.gausstech.io:9091/offline/" + getCookie("my_id") + "/";
    console.log(getRequest(url));
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
    let my_id = getCookie("my_id");

    if(tipo == "intercom"){
      console.log("Chegou comando para o intercom : " + id);
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
        url = "https://api.gausstech.io:9091/audio/online/" + my_id + "/";
        console.log(getRequest(url));
      }
      if(comando == "stop"){
        console.log("Desconectando audio do intercom..");
        sessionDisconnect();
        url = "https://api.gausstech.io:9091/audio/offline/" + my_id + "/";
        console.log(getRequest(url));
      }
      if(comando == "reload"){
        location.reload();
      }      
    }
};

function initIntercom(id){
  if(id == "b827ebd97628"){
    session_id = "1_MX40NzE3MzczNH5-MTYzNTQ0MzM1MTI0OX5nVTBMZ054VWp1R3Z5ckRjV3NVcktlUDF-UH4";
    apiKey = "47173734";
    token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9MTU4M2FhMGIwYjk1Y2U4MmRjOWI5NGU1NTlkOWYwOWRkNmFkZjQ3ODpzZXNzaW9uX2lkPTFfTVg0ME56RTNNemN6Tkg1LU1UWXpOVFEwTXpNMU1USTBPWDVuVlRCTVowNTRWV3AxUjNaNWNrUmpWM05WY2t0bFVERi1VSDQmY3JlYXRlX3RpbWU9MTYzNTQ0MzM5MCZub25jZT0wLjM2MDE1NDY1MDkwOTk2NCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjM2MDQ4MTgyJmNvbm5lY3Rpb25fZGF0YT1pbnRlcmNvbS1iODI3ZWJkOTc2MjgmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
    topic = "cetam/intercom/" + id;
    startAPI = topic + "/apikey";
    startSession = topic + "/session";
    startToken = topic + "/token";
    startUp = topic + "/start";

    sendMessage(startAPI, apiKey);
    sendMessage(startSession, session_id);
    sendMessage(startToken, token);
    sendMessage(startUp, "start");
    url = "https://api.gausstech.io:9091/audio/online/" + getCookie("my_id") + "/";
    console.log(getRequest(url));
  }
  if(id == "b827eb3da438"){
    // session_id = "2_MX40NzM2NTI4MX5-MTYzNTI2NTg2NDY1NX50cVRzcnNoZFQzSGpNWU9yZ0taczFTNnh-UH4";
    // apiKey = "47365281";
    // token = "T1==cGFydG5lcl9pZD00NzM2NTI4MSZzaWc9ZTk1NDkyNTgyZWI3ODhhMGRlMDczMjhiYWZhNWRlYjM0M2RlMzVlNDpzZXNzaW9uX2lkPTJfTVg0ME56TTJOVEk0TVg1LU1UWXpOVEkyTlRnMk5EWTFOWDUwY1ZSemNuTm9aRlF6U0dwTldVOXlaMHRhY3pGVE5uaC1VSDQmY3JlYXRlX3RpbWU9MTYzNTI2NTk1MCZub25jZT0wLjgxMDM2OTIzMzYyMzM5OTImcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzNzg1Nzk0MyZjb25uZWN0aW9uX2RhdGE9aW50ZXJjb20maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
    // topic = "cetam/intercom/" + id;
    // startAPI = topic + "/apikey";
    // startSession = topic + "/session";
    // startToken = topic + "/token";

    // sendMessage(startAPI, apiKey);
    // sendMessage(startSession, session_id);
    // sendMessage(startToken, token);    
  }
}

function stopIntercom(id){
  topic = "cetam/intercom/" + id + "/stop";
  console.log(topic);
  sendMessage(topic, "");
}

function reloadIntercom(id){
  topic = "cetam/intercom/" + id + "/reload";
  console.log(topic);
  sendMessage(topic, "");
}

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