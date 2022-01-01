var intercom_name = getCookie("my_id");

var json_return;
// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var publisher_intercom;
var session;

var sub;
var stream;

function initializeSession(key, session_id, my_token) {
  var apiKey = key;
  var sessionId = session_id;
  token = my_token;

  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    if(event.stream.name == "CommandCenterDEV"){
      session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '20%',
        height: '20%'
      }, handleError);
    }

    if(event.stream.name == "controller"){
      session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '20%',
        height: '20%'
      }, handleError);
    }
    unsubscribeCC();
  });

  // Create a publisher
  publisher_intercom = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '20%',
    height: '20%',
    videoSource : null,
    name : "intercom-" + intercom_name,
    echoCancellation : true,
    noiseSuppression : true
  }, handleError);

  publisher_intercom.publishVideo(false);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher_intercom, handleError);
    }
  });

  session.on("signal", function(event) {
    console.log("Signal sent from connection " + event.from.id);

    if(event.type == unit){
      var comando = event.data;
      var items = comando.split(":");
      console.log(items);
      if(items[0] == "intercom" && items[1] == "speaker" && items[2] == "off"){
        unsubscribeCC();
      }
      if(items[0] == "intercom" && items[1] == "speaker" && items[2] == "on"){
        subscribeCC();
      }
    }
    // Process the event.data property, if there is any data.
  });

}

function sessionDisconnect(){
  session.disconnect();
}

function intercomMicrophone(status){
  if(status == "on"){
    console.log("Abrindo microfone.")
  }
  if(status == "off"){
    console.log("Fechando microfone.")
  }
}

function intercomSpeaker(status){
  if(status == "on"){
    console.log("Abrindo speaker.")
  }
  if(status == "off"){
    console.log("Fechando speaker.")
  }
}

function subscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "CommandCenterDEV"){stream = item;} });
  sub = session.getSubscribersForStream(stream);
  sub[0].subscribeToAudio(true);
}

function unsubscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "CommandCenterDEV"){stream = item;} });
  try{
    sub = session.getSubscribersForStream(stream);
    sub[0].subscribeToAudio(false);
  }catch(err){
    console.log("Tentou subscribe mas nao ha streams.")
    //console.log(err);
  }
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
        dataType: 'jsonp',
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
  mqtt_icon.style.color = "green";
}

function checkUpdatesFrontEnd_OFF(element){
  mac_address = element.mac_address;
  status_mqtt = "statusMQTT_" + mac_address;
  mqtt_icon = document.getElementById(status_mqtt);
  mqtt_icon.style.color = "red";
}

function checkUpdatesAudioON(element){
  mac_address = element.mac_address;
  status_audio = "statusAudio_" + mac_address;
  audio_icon = document.getElementById(status_audio);
  audio_icon.style.color = "green";
}

function checkUpdatesAudioOFF(element){
  mac_address = element.mac_address;
  status_audio = "statusAudio_" + mac_address;
  audio_icon = document.getElementById(status_audio);
  audio_icon.style.color = "red";
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

  // sendMessage("cetam/intercom/b827ebd97628", "stats");
}


// window.addEventListener('beforeunload', function (e) {
//   //e.preventDefault();
//   e.returnValue = '';
//   url = mqtt_api + "offline/" + getCookie("my_id") + "/";
//   getRequest(url);

//   url = mqtt_api + "audio/offline/" + getCookie("my_id") + "/";
//   getRequest(url);
// });