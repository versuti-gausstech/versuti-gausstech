let host = "mqtt.gausstech.io";
let port = 9001;

let topic = 'cetam/intercom/b827ebd97628/#';
let stats_topic = 'cetam/intercom/stats/#';
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
    let my_id = getCookie("my_id");
    var client_id;
    if(my_id != ""){
      // gera um client_id com o MAC address do intercom
      client_id = "intercom-" + getCookie("my_id");
    }else{
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
    var my_id = getCookie("my_id");
    var topic = "cetam/intercom/#";
    mqtt.subscribe(topic, { qos: 0 });

    console.log("Aguardando comandos de audio do controlador. ID : " + getCookie("my_id"));
    connected = true;
};

function onConnectionLost(response) {
    setTimeout(MQTTconnect, reconnectTimeout);
    console.log("Connection lost.");
    console.log(response);
    url = mqtt_api + "offline/" + getCookie("my_id") + "/";
    console.log(getRequest(url));
};

function onMessageArrived(message) {
    let topic = message.destinationName;
    let payload = message.payloadString;

    // exemplos de topico da mensagem : 
    //  topico : cetam/intercom/b827ebd97628/stats mensagem: ""
    //  topico : cetam/intercom/b827ebd97628/audio mensagem: JSON
    //
    let topics = topic.split('/');
    let cliente = topics[0];
    let tipo = topics[1];
    let id = topics[2];
    let comando = topics[3];
    let my_id = getCookie("my_id");

    if(id == "stats"){
      stats = JSON.parse(payload)

      // stats.id contem o mac_address
      cpuTmp = document.getElementById("cpuTemp_" + stats.id);

      // tenta encontrar elemento identificado pelo mac address
      // se encontrar, atualiza com os valores recebidos
      if(cpuTmp){
        usedRAM = Math.round((stats.ram.used / stats.ram.total)*100);
        cpuTmp.innerHTML = "CPU: " + stats.cpu.temp + "<i class='bi bi-thermometer'></i> RAM (usado): " + usedRAM.toString() + "%";
      }
    }
    if(comando == "heartbeat"){
      // chegou um pedido ou entrega de heartbeat
      if(payload == "heartbeat"){
        // chegou um heartbeat
        mac_address = id; // pega o mac address de quem enviou o heartbeat
        console.log(mac_address);
        status_mqtt = "statusMQTT_" + mac_address;
        mqtt_icon = document.getElementById(status_mqtt);
        if(mqtt_icon){
          mqtt_icon.style.color = "green";
        }        
      }
    }    
};

function initIntercom(id){
  if(id == "b827ebd97628"){
    session_id = "2_MX40NzE3MzczNH5-MTYzNjA1MTk2NTc5MH5HWVdJS1V5Tm45SFRncXlmLy9hRGpWcWx-UH4";
    apiKey = "47173734";
    token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9NjBhMzQwZWE3N2RlYzFiOTlkZjQyYjUxOTlkZDc3Y2IyM2QyODgyODpzZXNzaW9uX2lkPTJfTVg0ME56RTNNemN6Tkg1LU1UWXpOakExTVRrMk5UYzVNSDVIV1ZkSlMxVjVUbTQ1U0ZSbmNYbG1MeTloUkdwV2NXeC1VSDQmY3JlYXRlX3RpbWU9MTYzNjA1MTk4NiZub25jZT0wLjI0NzA4NDkyNTM3MDQzNDU4JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MzY2NTY3ODUmY29ubmVjdGlvbl9kYXRhPWludGVyY29tJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";
    topic = "cetam/intercom/" + id;
    startAPI = topic + "/apikey";
    startSession = topic + "/session";
    startToken = topic + "/token";
    startUp = topic + "/start";

    sendMessage(startAPI, apiKey);
    sendMessage(startSession, session_id);
    sendMessage(startToken, token);
    sendMessage(startUp, "start");
    url = mqtt_api + "audio/online/" + getCookie("my_id") + "/";
    console.log(getRequest(url));
    
    // token gerado para o dashboard entrar na sessao
    var token_dashboard = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9MGU5YWE5YWU4OTI1ZWYxNzU0YWM4NzJmZjA5MmNiYjBhYzQxMzNkNjpzZXNzaW9uX2lkPTJfTVg0ME56RTNNemN6Tkg1LU1UWXpOakExTVRrMk5UYzVNSDVIV1ZkSlMxVjVUbTQ1U0ZSbmNYbG1MeTloUkdwV2NXeC1VSDQmY3JlYXRlX3RpbWU9MTYzNjA1MjQ5MyZub25jZT0wLjE5OTk1ODQxMTQ4ODQ0NzYyJnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE2MzY2NTcyOTImY29ubmVjdGlvbl9kYXRhPWNvbnRyb2xhZG9yJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";
    initializeSession(apiKey, session_id, token_dashboard);
  }
  if(id == "b827eb3da438"){
    session_id = "2_MX40NzM2NTI4MX5-MTYzNTI2NTg2NDY1NX50cVRzcnNoZFQzSGpNWU9yZ0taczFTNnh-UH4";
    apiKey = "47365281";
    token = "T1==cGFydG5lcl9pZD00NzM2NTI4MSZzaWc9ZTk1NDkyNTgyZWI3ODhhMGRlMDczMjhiYWZhNWRlYjM0M2RlMzVlNDpzZXNzaW9uX2lkPTJfTVg0ME56TTJOVEk0TVg1LU1UWXpOVEkyTlRnMk5EWTFOWDUwY1ZSemNuTm9aRlF6U0dwTldVOXlaMHRhY3pGVE5uaC1VSDQmY3JlYXRlX3RpbWU9MTYzNTI2NTk1MCZub25jZT0wLjgxMDM2OTIzMzYyMzM5OTImcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzNzg1Nzk0MyZjb25uZWN0aW9uX2RhdGE9aW50ZXJjb20maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
    topic = "cetam/intercom/" + id;
    startAPI = topic + "/apikey";
    startSession = topic + "/session";
    startToken = topic + "/token";

    sendMessage(startAPI, apiKey);
    sendMessage(startSession, session_id);
    sendMessage(startToken, token);    
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

function getSessionData(item){
  // mac_address = element.mac_address;
  // status_audio = "statusAudio_" + mac_address;
  // audio_icon = document.getElementById(status_audio);
  // audio_icon.style.color = "red";

  if(item.name.includes("intercom")){
    console.log("ha um intercom conectado");
  }
  

}

function checkAudio(id){
  if(id == "b827ebd97628"){
    session_id = "1_MX40NzE3MzczNH5-MTYzNTQ0MzM1MTI0OX5nVTBMZ054VWp1R3Z5ckRjV3NVcktlUDF-UH4";
    url = opentok_api + "status/" + session_id + "/";
    session_info = getJSON(url);
    if(session_info.total_streams > 0){
      session_info.streams.forEach(getSessionData);
    }else{
      console.log("Nao ha streams ligados.");
    }
    console.log(session_info);
  }
}

function reloadIntercom(id){
  topic = "cetam/intercom/" + id + "/reload";
  console.log(topic);
  sendMessage(topic, "");
}

function getSessionData(item){
  // mac_address = element.mac_address;
  // status_audio = "statusAudio_" + mac_address;
  // audio_icon = document.getElementById(status_audio);
  // audio_icon.style.color = "red";

  if(item.name.includes("intercom")){
    console.log("ha um intercom conectado");
  }
  

}

function checkAudio(id){
  if(id == "b827ebd97628"){
    session_id = "1_MX40NzE3MzczNH5-MTYzNTQ0MzM1MTI0OX5nVTBMZ054VWp1R3Z5ckRjV3NVcktlUDF-UH4";
    url = opentok_api + "status/" + session_id + "/";
    session_info = getJSON(url);
    if(session_info.total_streams > 0){
      session_info.streams.forEach(getSessionData);
    }else{
      console.log("Nao ha streams ligados.");
    }
    console.log(session_info);
  }
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