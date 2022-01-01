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

//   // Create a publisher
//   pub_intercom_options = {
//     insertMode: 'append',
//     publishVideo: true,
// //    width: '50%',
// //    height: '50%',
//     //videoSource : null,
//     name : "intercom-" + intercom_name,
//     echoCancellation : true,
//     noiseSuppression : true
//   }

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
    console.log("Novo stream: " + stream_name);
    if(stream_name.includes("CommandCenter")){
      subscriber_commandcenter = session.subscribe(event.stream, 'subscriber', subscriber_commandcenter_options, handleError);
    }
  });
  publisher_intercom.on("streamDestroyed", function (event) {
    console.log("The publisher stopped streaming. Reason: "
      + event.reason);
    sendMessage("cetam/intercom/" + my_id + "/connect", "offline");

  });

  publisher_intercom.on("streamCreated", function (event) {
    console.log("Stream do publisher intercom criado! ");
    sendMessage("cetam/intercom/" + my_id + "/connect", "online");
  });
}

function setIntercomMic(state){
  console.log("Intercom mic:" + state);
  if(publisher_intercom){
    if(state == 'on'){
      publisher_intercom.publishAudio(true);
    }else{
      publisher_intercom.publishAudio(false);
    }
  }else{
    console.log("Sem publisher para controlar.")
  }
}

function setIntercomSpeaker(state){
  console.log("Intercom speaker:" + state);
  if(subscriber_commandcenter){
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
  }else{
    console.log("Sem subscriber para controlar.")
  }
}


function sessionDisconnect(){
  session.disconnect();
}