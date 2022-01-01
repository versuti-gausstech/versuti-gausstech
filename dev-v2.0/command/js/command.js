// replace these values with those generated in your TokBox Account
// var apiKey = "47173734";
// var sessionId = "2_MX40NzE3MzczNH5-MTYzNjA1MTk2NTc5MH5HWVdJS1V5Tm45SFRncXlmLy9hRGpWcWx-UH4";
// var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9ZjdlMzE4Nzg5ZDY2ZWQ2ZDU5ZDA2YjYxMTNmY2RiOTAwMTcxMzM4MzpzZXNzaW9uX2lkPTJfTVg0ME56RTNNemN6Tkg1LU1UWXpOakExTVRrMk5UYzVNSDVIV1ZkSlMxVjVUbTQ1U0ZSbmNYbG1MeTloUkdwV2NXeC1VSDQmY3JlYXRlX3RpbWU9MTYzNjEzMzMzNiZub25jZT0wLjMyNTA2MDc3NjE4NjMzMTMzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MzY3MzgxMzYmY29ubmVjdGlvbl9kYXRhPUNvbW1hbmRDZW50ZXImaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var commandcenter_pub_options = { 
  publishAudio: true, 
  publishVideo:false,
  insertMode: 'append',
  width: '15%',
  height: '15%',
  name : "CommandCenter-5"
};

var intercom_sub_options = {
  insertMode: 'append',
  width: '15%',
  height: '15%',
  showControls : true
}

var enfermagem_sub_options = {
  insertMode: 'append',
  width: '15%',
  height: '15%',
  showControls : true
}

var session;

var publisher_commandcenter;
var intercom_subscriber;
var enfermagem_subscriber;

var intercom_stream;
var enfermagem_stream;

var online_clients = [];

//initializeSession();

function initializeSession(key, session_id, my_token) {
  var apiKey = key;
  var sessionId = session_id;
  token = my_token;

  // cria uma sessao e um publisher para esse modulo (command center)
  session = OT.initSession(apiKey, sessionId);
  publisher_commandcenter = publishCommandCenter(session);
  
  // lista de eventos
  // streamCreated
  // streamDestroyed
  // sessionConnected
  // sessionDisconnected

  // Quando um novo stream aparece, faz o subscribe especifico
  // Se eh um stream de intercom/enfermagem, verifica e usa as opcoes de cada situacao
  session.on('streamCreated', function(event) {
    console.log("Novo stream criado: ");
    if(online_clients.includes(event.stream.name)){
      console.log("Cliente ja havia sido adicionado");
    }else{
      online_clients.push(event.stream.name);
    }

    if(event.stream.name.includes('intercom')){
      intercom_stream = event.stream;
      subscribeIntercom(session, intercom_stream);
    }
    if(event.stream.name.includes('enfermagem')){
      enfermagem_stream = event.stream;
      subscribeEnfermagem(session, enfermagem_stream);
    }
  });

  session.on("streamDestroyed", function(event) {
    console.log("Stream destruido :" + event.stream.name);
    session.unsubscribe(event.stream);
  });

  session.on("sessionConnected", function(event) {
    console.log("Sessao conectada");
  });

  session.on("sessionDisonnected", function(event) {
    console.log("Sessao desconectada");
  });
}

// funcoes
function publishCommandCenter(session_obj){
  // Create a publisher
  publisher_commandcenter = OT.initPublisher('publisher', commandcenter_pub_options, handleError);
  
  // Connect to the session
  session_obj.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session_obj.publish(publisher_commandcenter, handleError);
    }
  });
  return publisher_commandcenter;
}

function subscribeIntercom(session_obj, stream_obj){
  intercom_subscriber = session_obj.subscribe(stream_obj, 'subscriber', intercom_sub_options, handleError);
  console.log("Subscribing : " + stream_obj.streamId);
}

function subscribeEnfermagem(session_obj, stream_obj){
  enfermagem_subscriber = session_obj.subscribe(stream_obj, 'subscriber', enfermagem_sub_options, handleError);  
  console.log("Subscribing : " + stream_obj.streamId);
}


function setCommandCenterMic(state){
  console.log("Command Center mic:" + state);
  if(publisher_commandcenter){
    if(state == 'on'){
      publisher_commandcenter.publishAudio(true);
    }else{
      publisher_commandcenter.publishAudio(false);
    }
  }else{
    console.log("Sem publisher para controlar.");
  }
}

function setEnfermagemSpeaker(state){
  console.log("Enfermagem speaker:" + state);
  if(enfermagem_subscriber){
    if(state == 'on'){
      enfermagem_subscriber.subscribeToAudio(true);
    }else{
      enfermagem_subscriber.subscribeToAudio(false);
    }
  }else{
    console.log("Sem subscriber para ajustar audio.");
  }
}

function setIntercomSpeaker(state){
  console.log("Intercomspeaker:" + state);
  if(intercom_subscriber){
    if(state == 'on'){
        intercom_subscriber.subscribeToAudio(true);
    }else{
      intercom_subscriber.subscribeToAudio(false);
    }
  }else{
    console.log("Sem subscriber para ajustar audio.");
  }
}