let useTLS = true;
let cleansession = true;
let reconnectTimeout = 1000;

var mqtt;
let connected = false;

function MQTTconnect() {
    if (typeof path == "undefined") {
        path = '/';
    }
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
    // var my_id = getCookie("my_id");

    console.log("Connected to " + host + ":" + port)
    console.log("My id: " + my_id);
    console.log("Topicos assinados:");
    // topicos a serem assinados
    // topico geral desse intercom (mac address)
    var topic = client_name + "/intercom/" + my_id + "/#";
    mqtt.subscribe(topic, { qos: 0 });
    console.log(topic);

    // topico geral de stats para o RPi
    // var stats_topic = client_name + '/intercom/stats/#';
    // mqtt.subscribe(stats_topic, { qos:0});
    
    console.log("Aguardando comandos de audio do controlador. ID : " + my_id);
    connected = true;
    
    if(my_id != ""){
      audio_topic = client_name + "/intercom/" + my_id + "/audio";
      mqtt.subscribe(audio_topic, { qos:0});

      connect_topic = client_name + "/intercom/" + my_id + "/connect";
      mqtt.subscribe(connect_topic, { qos:0});

      console.log("Audio topic assinado.");

      console.log("Enviando heartbeat para o broker MQTT");
      heartbeat_topic = "cetam/intercom/" + my_id + "/heartbeat";
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
    //  topico : cetam/intercom/b827ebd97628/stats mensagem: ""
    //  topico : cetam/intercom/b827ebd97628/audio mensagem: JSON
    //
    let topics = topic.split('/');
    let cliente = topics[0];
    let tipo = topics[1];
    let id = topics[2];
    let comando = topics[3];
    console.log("MESSAGE ARRIVED. Cliente : " + cliente + " | tipo: " + tipo + " | comando : " + comando + " | payload : " + payload);

    if(comando == "heartbeat"){
      if(payload == "get"){
        console.log("Hearbeat pedido.. enviado!");
        heartbeat_topic = "cetam/intercom/" + my_id + "/heartbeat";
        msg = new Paho.MQTT.Message("heartbeat");
        msg.destinationName = heartbeat_topic;
        mqtt.send(msg);
      }
    }

    if(comando == "audio"){
        json_command = JSON.parse(payload);
        if(json_command.type == "speaker"){
          setIntercomSpeaker(json_command.command);
        }
        if(json_command.type == "mic"){
          setIntercomMic(json_command.command);
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
    if(comando == "close"){
      window.close();
    }      
};



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



$(document).ready(function () {
    MQTTconnect();
});