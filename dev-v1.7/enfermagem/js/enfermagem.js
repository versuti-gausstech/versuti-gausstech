// GAUSS TECH
// Funcoes de audio OpenTok para o enfermagem

var enfermagem_name = "enf-3";

var json_return;
// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var publisher_enfermagem;
var subscriber_commandcenter;
var session;
var pub_enfermagem_options = {
  insertMode: 'append',
  publishVideo: false,
  width: '20%',
  height: '20%',
  videoSource : null,
  name : "enfermagem-" + enfermagem_name,
  echoCancellation : true,
  noiseSuppression : true
};

var sub;
var stream;

function initializeSession(key, session_id, my_token) {
  var apiKey = key;
  var sessionId = session_id;
  token = my_token;

  // Create a publisher
  session = OT.initSession(apiKey, sessionId);
  publisher_enfermagem = publishEnfermagem(session);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher_enfermagem, handleError);
    }
  });

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    var stream_name = event.stream.name;
    console.log("Novo stream: " + stream_name);
    if(stream_name.includes("CommandCenter")){
      subscriber_commandcenter = session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '20%',
        height: '20%'
      }, handleError);
      console.log("Subscribing :" + stream_name);
    }
  });

  publisher_enfermagem.on("streamDestroyed", function (event) {
    console.log("The publisher stopped streaming. Reason: "
      + event.reason);
  });
}

function publishEnfermagem(session_obj){
  // Create a publisher
  publisher_enfermagem = OT.initPublisher('publisher', pub_enfermagem_options, handleError);
  console.log("Publishing : " + publisher_enfermagem);
  // Connect to the session
  session_obj.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session_obj.publish(publisher_enfermagem, handleError);
    }
  });
  return publisher_enfermagem;
}

function setEnfermagemMic(state){
  console.log("Enfermagem mic:" + state);
  if(publisher_enfermagem){
    if(state == 'on'){
      publisher_enfermagem.publishAudio(true);
    }else{
      publisher_enfermagem.publishAudio(false);
    }
  }else{
    console.log("Sem publisher para controlar.")
  }
}

function setEnfermagemSpeaker(state){
  console.log("Enfermagem speaker:" + state);
  if(subscriber_commandcenter){
    if(state == 'on'){
      if(subscriber_commandcenter){
        subscriber_commandcenter.subscribeToAudio(true);
        speaker_icon = document.getElementById("bSpeaker");
        speaker_icon.style.color = "white";
        speaker_icon.classList.value = "fas fa-volume-up";
 
      }else{
        console.log("Sem subscriber do Command Center para ajustar audio.");
      }
    }else{
      if(subscriber_commandcenter){
        subscriber_commandcenter.subscribeToAudio(false);
        speaker_icon = document.getElementById("bSpeaker");
        speaker_icon.style.color = "red";
        speaker_icon.classList.value = "fas fa-volume-mute";        
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