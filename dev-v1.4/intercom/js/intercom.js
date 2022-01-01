// GAUSS TECH
// Funcoes de audio OpenTok para o intercom acessando intercom.php

var intercom_name = getCookie("my_id");

var json_return;
// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var publisher_intercom;
var subscriber_commandcenter;
var session;

var sub;
var stream;

function initializeSession(key, session_id, my_token) {
  var apiKey = key;
  var sessionId = session_id;
  token = my_token;

  session = OT.initSession(apiKey, sessionId);

  // Create a publisher
  pub_intercom_options = {
    insertMode: 'append',
    publishVideo: false,
    width: '20%',
    height: '20%',
    videoSource : null,
    name : "intercom-" + intercom_name,
    echoCancellation : true,
    noiseSuppression : true
  }

  publisher_intercom = OT.initPublisher('publisher', pub_intercom_options, handleError);
 

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher_intercom, handleError);
    }
  });

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    var stream_name = event.stream.name;
    if(stream_name.includes("CommandCenter")){
      subscriber_commandcenter = session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '20%',
        height: '20%'
      }, handleError);
    }
  });
}

function setIntercomMic(state){
  console.log("Intercom mic:" + state);
  if(state == 'on'){
    publisher_intercom.publishAudio(true);
  }else{
    publisher_intercom.publishAudio(false);
  }
}

function setIntercomSpeaker(state){
  console.log("Intercom speaker:" + state);
  if(state == 'on'){
    if(subscriber_commandcenter){
      subscriber_commandcenter.subscribeToAudio(true);
    }else{
      console.log("Sem subscriber do Command Center para ajustar audio.");
    }
  }else{
    if(subscriber_commandcenter){
      subscriber_commandcenter.subscribeToAudio(false);
    }else{
      console.log("Sem subscriber do Command Center para ajustar audio.");
    }
  }
}


function sessionDisconnect(){
  session.disconnect();
}