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

function sendMessage(topic, message){
  msg = new Paho.MQTT.Message(message);
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