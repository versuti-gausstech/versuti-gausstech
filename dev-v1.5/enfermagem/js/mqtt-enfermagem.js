//const { message } = require("hawk/lib/client");

let host = "mqtt.gausstech.io";
let port = 9001;

let topic = client_name + '/enfermagem/b827ebd97628/#';

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
var client_id ;
var client_name = "cetam";

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
    client_id = "enf-3";

    mqtt = new Paho.MQTT.Client(host, port, path, client_id);
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
    var my_id = client_id;

    // topicos a serem assinados
    // topico geral dessa enfermagem (mac address)
    var topic = client_name + "/enfermagem/" + my_id + "/#";
    mqtt.subscribe(topic, { qos: 0 });

    // topico geral de stats para o RPi
    var stats_topic = client_name + '/enfermagem/stats/#';
    mqtt.subscribe(stats_topic, { qos:0});
    
    console.log("Aguardando comandos de audio do controlador. ID : " + my_id);
    connected = true;
    
    if(my_id != ""){
      audio_topic = client_name + "/enfermagem/" + my_id + "/audio";
      mqtt.subscribe(audio_topic, { qos:0});
      console.log("Audio topic assinado.");

      console.log("Enviando heartbeat para o broker MQTT");
      heartbeat_topic = "cetam/enfermagem/" + my_id + "/heartbeat";
      msg = new Paho.MQTT.Message("heartbeat");
      msg.destinationName = heartbeat_topic;
      mqtt.send(msg);
    }
};

function onConnectionLost(response) {
    setTimeout(MQTTconnect, reconnectTimeout);
    console.log("Connection lost.");
    console.log(response);
};

function onMessageArrived(message) {
    let topic = message.destinationName;
    let payload = message.payloadString;

    // exemplos de topico da mensagem : 
    //  topico : cetam/enfermagem/b827ebd97628/stats mensagem: ""
    //  topico : cetam/enfermagem/b827ebd97628/audio mensagem: JSON
    //
    let topics = topic.split('/');
    let cliente = topics[0];
    let tipo = topics[1];
    let id = topics[2];
    let comando = topics[3];
    let my_id = getCookie("my_id");
    //console.log("MESSAGE ARRIVED. Cliente : " + cliente + " | tipo: " + tipo + " | comando : " + comando + " | payload : " + payload);
    // if(id == "stats"){
    //   stats = JSON.parse(payload)
    //   cpuTmp = document.getElementById("cpuTemp_" + stats.id);
    //   if(cpuTmp){
    //     usedRAM = Math.round((stats.ram.used / stats.ram.total)*100);
    //     cpuTmp.innerHTML = "CPU: " + stats.cpu.temp + "<i class='bi bi-thermometer'></i> RAM (usado): " + usedRAM.toString() + "%";
    //   }
    // }
    if(comando == "heartbeat"){
      if(payload == "get"){
        console.log("Hearbeat pedido.. enviado!");
        heartbeat_topic = "cetam/enfermagem/" + my_id + "/heartbeat";
        msg = new Paho.MQTT.Message("heartbeat");
        msg.destinationName = heartbeat_topic;
        mqtt.send(msg);
      }
    }

    if(comando == "audio"){
        json_command = JSON.parse(payload);
        if(json_command.type == "speaker"){
          setEnfermagemSpeaker(json_command.command);
        }
        if(json_command.type == "mic"){
          setEnfermagemMic(json_command.command);
        }
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
      console.log("Conectando audio da enfermagem..");
      initializeSession(apiKey, session_id, my_token);
      
      if(my_id != ""){
        url = mqtt_api + "audio/online/" + my_id + "/";
        console.log(getRequest(url));
      }
    }
    if(comando == "stop"){
      console.log("Desconectando audio da enfermagem..");
      sessionDisconnect();
      if(my_id != ""){
        url = mqtt_api + "audio/offline/" + my_id + "/";
        console.log(getRequest(url));
      }
    }
    if(comando == "reload"){
      location.reload();
    }      
    if(comando == "close"){
      window.close();
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