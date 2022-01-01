//let host = "18.229.135.194";
let host = "mqtt.gausstech.io";
let port = 9001;
//let port = 8083;
let topic = 'cetam/intercom/0xb827eb3da438/#';
let useTLS = true;
let cleansession = true;
let reconnectTimeout = 1000;
let tempData = new Array();
let mqtt;
let connected = false;
let calling = false;

let my_topic = 'cetam/enfermagem/' + getCookie('username');

var text = document.getElementById("txtCommandCenter");

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
          // $('#status').html("Connection failed: " + message.errorMessage + "Retrying...")
          //     .attr('class', 'alert alert-danger');
          setTimeout(MQTTconnect, reconnectTimeout);
      }
  };

  mqtt.onConnectionLost = onConnectionLost;
  mqtt.onMessageArrived = onMessageArrived;
  console.log("Host: " + host + ", Port: " + port + ", Path: " + path + " TLS: " + useTLS);
  mqtt.connect(options);
};

function onConnect() {
  // $('#status').html('Connected to ' + host + ':' + port + path)
  //     .attr('class', 'alert alert-success');
  console.log("Connected to " + host + ":" + port)
  //mqtt.subscribe(my_topic, { qos: 0 });
  subscribeMQTT(my_topic);
  connected = true;
  //$('#topic').html(topic);
};

function onConnectionLost(response) {
  //connected = false;
  setTimeout(MQTTconnect, reconnectTimeout);
  // $('#status').html("Connection lost. Reconnecting...")
  //     .attr('class', 'alert alert-warning');
  console.log("Connection lost.");

};

function onMessageArrived(message) {
  let topic = message.destinationName;
  let payload = message.payloadString;
  console.log("Topic: " + topic + ", Message payload: " + payload);
  //$('#message').html(topic + ', ' + payload);
  let topics = topic.split('/');
  let area = topics[1];
  var commandcenter = document.getElementById("bCommandCenter");
  PlaySound("incoming-command");

  if(payload == 'call'){
    console.log("Command center chamando..");
    calling = true;
    if(commandcenter.classList.contains('fa-user-alt-slash')){
      commandcenter.classList.remove('fa-user-alt-slash');
      commandcenter.classList.add('fa-user');
      commandcenter.classList.add('blink');
      commandcenter.style = "font-size:100px;color:red;";
      commandcenter.title = "Command Center chamando...";
      sendNotification();
      // PlaySound("incoming-command");
    }
  }
  if(payload == 'uncall'){
    calling = false;
    console.log("Command center parou de chamar.");
    if(commandcenter.classList.contains('fa-user')){
      commandcenter.classList.remove('fa-user');
      commandcenter.classList.remove('blink');
      commandcenter.classList.add('fa-user-alt-slash');
      commandcenter.style = "font-size:100px;color:white;";
      commandcenter.title = "Sem mensagens do Command Center.";
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
}

//subscribeMQTT(my_topic);
if(!connected){
  setTimeout(function (){

    // Something you want delayed.
    subscribeMQTT(my_topic);
    console.log("subscribed.");
    sendMessage(my_topic, 'testando');

  }, 1500);
}
console.log(connected);

function beep() {
  var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
  snd.play();
}

function PlaySound(soundObj) {
  var sound = document.getElementById(soundObj);
  sound.play();
  console.log("Playing sound..");
}

function reply(){
  var commandcenter = document.getElementById("bCommandCenter");
  var reply = document.getElementById("bReply");

  if(calling){
    console.log("Voltando..");
    commandcenter.classList.remove('blink');
    reply.style = "font-size:100px;color:yellow;";
    sendMessage(my_topic, "voltando");
  }else{
    console.log("Nao ha chamado.");
  }
}

function arrived(){
  var commandcenter = document.getElementById("bCommandCenter");
  var reply = document.getElementById("bReply");

  if(calling){
    console.log("Enfermagem chegou a sala de operacoes");
    calling = false;
    commandcenter.classList.remove('blink');
    commandcenter.classList.add('fa-user-alt-slash');
    commandcenter.style = "font-size:100px;color:white;";
    commandcenter.title = "Sem mensagens do Command Center.";
    reply.style = "font-size:100px;color:white;";
    sendMessage(my_topic, "cheguei");

  }else{
    console.log("Nao ha chamado.");
  }
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

