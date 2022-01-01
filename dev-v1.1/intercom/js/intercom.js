// replace these values with those generated in your TokBox Account
// var apiKey = "47173734";
// var sessionId = "1_MX40NzE3MzczNH5-MTYzMTI5ODc4NjQ2OH40Z3QwTjJudXhXVHdndldXaWlRbklUNXl-fg";
//var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9YWVkZWU5NWEwYTM2MDFkZDc0NThmNzA4MTFiMjY5MWJkOGQyYTdkZDpzZXNzaW9uX2lkPTFfTVg0ME56RTNNemN6Tkg1LU1UWXpNVEk1T0RjNE5qUTJPSDQwWjNRd1RqSnVkWGhYVkhkbmRsZFhhV2xSYmtsVU5YbC1mZyZjcmVhdGVfdGltZT0xNjMxMjk4OTgwJm5vbmNlPTAuMzg5MTIwNzA1NjI3MTA1NTUmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzMTkwMzc4MCZjb25uZWN0aW9uX2RhdGE9aW50ZXJjb20maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
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


var unidade = "unidade-3";
//initializeSession();

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
    //console.log("Signal sent from connection " + event.from.id);
    var unit = "signal:" + unidade;
    console.log("Chegou sinal");
    console.log(unidade);
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

function subscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "CommandCenterDEV"){stream = item;} });
  sub = session.getSubscribersForStream(stream);
  sub[0].subscribeToAudio(true);
}

function unsubscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "CommandCenterDEV"){stream = item;} });
  sub = session.getSubscribersForStream(stream);
  sub[0].subscribeToAudio(false);
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

function listIntercoms(){
  json = getJSON("https://api.gausstech.io:9091/status/online/");
  console.log(json);
}

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
  frontend_online = getJSON('https://api.gausstech.io:9091/status/online/');
  frontend_online.intercoms.forEach(checkUpdatesFrontEnd_ON);

  frontend_offline = getJSON('https://api.gausstech.io:9091/status/offline/');
  frontend_offline.intercoms.forEach(checkUpdatesFrontEnd_OFF);

  audio_online = getJSON('https://api.gausstech.io:9091/status/audio/online/');
  audio_online.intercoms.forEach(checkUpdatesAudioON);
  console.log(audio_online);

  audio_offline = getJSON('https://api.gausstech.io:9091/status/audio/offline/');
  audio_offline.intercoms.forEach(checkUpdatesAudioOFF);
  console.log(audio_offline);

}

$(window).on("unload", function(e) {
  // Do Something
  url = "https://api.gausstech.io:9091/offline/" + getCookie("my_id") + "/";
  getRequest(url);

  url = "https://api.gausstech.io:9091/audio/offline/" + getCookie("my_id") + "/";
  getRequest(url);
});
