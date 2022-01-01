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
    online_clients = [];
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

function micSwitch(id){
  console.log(id);
  mic_icon = document.getElementById("mic_" + id);
  
  if(mic_icon.classList.value == "bi bi-mic-mute-fill"){
    console.log("Abrindo microfone");
    mic_icon.classList.value = "bi bi-mic-fill";
    mic_icon.style.color = "blue";
  }else{
    console.log("Fechando microfone");
    mic_icon.classList.value = "bi bi-mic-mute-fill";
    mic_icon.style.color = "red";
  }
}

function speakerSwitch(id){
  console.log(id);
  speaker_icon = document.getElementById("speaker_" + id);
  
  if(speaker_icon.style.color == "red"){
    console.log("Abrindo speaker");
    speaker_icon.style.color = "blue";
  }else{
    console.log("Fechando speaker");
    speaker_icon.style.color = "red";
  }
}

function updateIntercoms(){
  sendMessage("cetam/intercom/b827ebd97628/heartbeat", "get");
  sendMessage("cetam/intercom/b827eb3da438/heartbeat", "get");

  audio_online = getJSON(mqtt_api + "status/audio/online/");
  audio_online.intercoms.forEach(checkUpdatesAudioON);
  console.log(audio_online);

  audio_offline = getJSON(mqtt_api + "status/audio/offline/");
  audio_offline.intercoms.forEach(checkUpdatesAudioOFF);
  console.log(audio_offline);

  //sendMessage("cetam/intercom/b827ebd97628", "stats");
}

$(window).on("unload", function(e) {
  // Do Something
  url = mqtt_api + "offline/" + getCookie("my_id") + "/";
  getRequest(url);

  url = mqtt_api + "audio/offline/" + getCookie("my_id") + "/";
  getRequest(url);
});