// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    console.log(error.message);
    alert(error.message);
  }
}

var publisher_command;
var session;
var thesubscriber;
var falando = false;
subscriber = [];
var stream;
s = [];
var online_clients = [];
var activity = null;
//initializeSession();

function initializeSession(key, session_id, my_token) {
  var apiKey = key;
  var sessionId = session_id;
  token = my_token;

  session = OT.initSession(apiKey, sessionId);
  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    console.log("Novo stream criado: ");
    online_clients.push(event.stream.name);
    thesubscriber = session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '5%',
      height: '5%',
      showControls : true
    }, handleError);
    console.log("Total de endpoints online: " + online_clients.length);
    online_clients.forEach(function(item,index){
      console.log("Cliente " + (index + 1) + " : " + item);
    });
    // var movingAvg = null;
    // thesubscriber.on('audioLevelUpdated', function(event) {
    //   if (movingAvg === null || movingAvg <= event.audioLevel) {
    //     movingAvg = event.audioLevel;
    //   } else {
    //     movingAvg = 0.7 * movingAvg + 0.3 * event.audioLevel;
    //   }

    //   // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
    //   var logLevel = (Math.log(movingAvg) / Math.LN10) / 1.5 + 1;
    //   logLevel = Math.min(Math.max(logLevel, 0), 1);
    //   if(logLevel >= 0){falando = true;
    //   }else{
    //     falando = false;
    //   }
    // });


    if(event.stream.name == "enfermagem-unidade-3"){ unsubscribeEnfermagem() ;}
    if(event.stream.name == "intercom-unidade-3"){ unsubscribeIntercom() ;}
  });

  // Create a publisher
  publisher_command = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '5%',
    height: '5%',
    //videoSource : null,
    publishVideo : false,
    publishAudio : true,
    name : "controller",
    echoCancellation : true,
    noiseSuppression : true,
    showControls : true
  }, handleError);


  
  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      publisher_command.publishVideo(false);
      session.publish(publisher_command, handleError);
    }
  });

  session.on("sessionDisconnected", function(event) {
    console.log("The session disconnected. " + event.reason);
  });

  session.on("signal", function(event) {
    var unidade_3 = "signal:unidade-3";
    if(event.type == unidade_3){
      var comando = event.data;
      var items = comando.split(":");
      console.log(items);
      if(items[0] == "intercom" && items[1] == "mic" && items[2] == "off"){
        console.log("Unsubscribing intercom");
        unsubscribeIntercom();
      }
      if(items[0] == "intercom" && items[1] == "mic" && items[2] == "on"){
        console.log("Subscribing intercom");
        subscribeIntercom();
      }
      if(items[0] == "enfermagem" && items[1] == "mic" && items[2] == "off"){
        console.log("Unsubscribing enfermagem");
        unsubscribeEnfermagem();
      }
      if(items[0] == "enfermagem" && items[1] == "mic" && items[2] == "on"){
        console.log("Subscribing enfermagem");
        subscribeEnfermagem();
      }
    }
    // Process the event.data property, if there is any data.
  });
}


function sessionDisconnect(){
  session.disconnect();
}


function getRequest(url){
  fetch(url, {mode: 'no-cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      //console.log(data);
    }).catch(function() {
    });
}

// substitui o getRequest
function getJSON(URL){
  var json = {};
    $.ajax({
        url: URL,
        async: false,
        dataType: 'json',
        success: function(data) {
            json = data;
        }
    });
  return json;
}

// function listIntercoms(){
//   json = getJSON("https://api.gausstech.io:9091/status/online/");
//   console.log(json);
// }

function checkUpdatesFrontEnd_ON(element){
  mac_address = element.mac_address;
  status_mqtt = "statusMQTT_" + mac_address;
  mqtt_icon = document.getElementById(status_mqtt);
  if(mqtt_icon){
    mqtt_icon.style.color = "green";
  }
}

function checkUpdatesFrontEnd_OFF(element){
  mac_address = element.mac_address;
  status_mqtt = "statusMQTT_" + mac_address;
  mqtt_icon = document.getElementById(status_mqtt);
  if(mqtt_icon){
    mqtt_icon.style.color = "red";
  }
}

function checkUpdatesAudioON(element){
  mac_address = element.mac_address;
  status_audio = "statusAudio_" + mac_address;
  audio_icon = document.getElementById(status_audio);
  if(audio_icon){
    audio_icon.style.color = "green";
  }
}

function checkUpdatesAudioOFF(element){
  mac_address = element.mac_address;
  status_audio = "statusAudio_" + mac_address;
  audio_icon = document.getElementById(status_audio);
  if(audio_icon){
    audio_icon.style.color = "red";
  }
}

function updateIntercoms(){
  frontend_online = getJSON(mqtt_api + "status/online/");
  frontend_online.intercoms.forEach(checkUpdatesFrontEnd_ON);

  frontend_offline = getJSON(mqtt_api + "status/offline/");
  frontend_offline.intercoms.forEach(checkUpdatesFrontEnd_OFF);

  audio_online = getJSON(mqtt_api + "status/audio/online/");
  audio_online.intercoms.forEach(checkUpdatesAudioON);
  console.log(audio_online);

  audio_offline = getJSON(mqtt_api + "status/audio/offline/");
  audio_offline.intercoms.forEach(checkUpdatesAudioOFF);
  console.log(audio_offline);

  sendMessage("cetam/intercom/b827ebd97628", "stats");
}

$(window).on("unload", function(e) {
  // Do Something
  url = mqtt_api + "offline/" + getCookie("my_id") + "/";
  getRequest(url);

  url = mqtt_api + "audio/offline/" + getCookie("my_id") + "/";
  getRequest(url);
});