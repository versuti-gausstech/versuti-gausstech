// replace these values with those generated in your TokBox Account
var apiKey = "47173734";
var sessionId = "2_MX40NzE3MzczNH5-MTYzNjA1MTk2NTc5MH5HWVdJS1V5Tm45SFRncXlmLy9hRGpWcWx-UH4";
var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9ZjdlMzE4Nzg5ZDY2ZWQ2ZDU5ZDA2YjYxMTNmY2RiOTAwMTcxMzM4MzpzZXNzaW9uX2lkPTJfTVg0ME56RTNNemN6Tkg1LU1UWXpOakExTVRrMk5UYzVNSDVIV1ZkSlMxVjVUbTQ1U0ZSbmNYbG1MeTloUkdwV2NXeC1VSDQmY3JlYXRlX3RpbWU9MTYzNjEzMzMzNiZub25jZT0wLjMyNTA2MDc3NjE4NjMzMTMzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2MzY3MzgxMzYmY29ubmVjdGlvbl9kYXRhPUNvbW1hbmRDZW50ZXImaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

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


var publisher_commandcenter;
var intercom_subscriber;
var enfermagem_subscriber;

var intercom_stream;
var enfermagem_stream;



var session;

var falando = false;
subscriber = [];
var stream;
s = [];
var online_clients = [];
var activity = null;


initializeSession();

function initializeSession() {
  //var apiKey = key;
  //var sessionId = session_id;
  //token = my_token;

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
    
    session.streams.forEach( function(item,index){if(item.name.includes('intercom')){intercom_stream = item}});
    session.streams.forEach( function(item,index){if(item.name.includes('enfermagem')){enfermagem_stream = item}});

    if(intercom_stream){
      subscribeIntercom(session, intercom_stream);
      //intercom_subscriber = session.subscribe(intercom_stream, 'subscriber', intercom_sub_options, handleError);
      console.log("Total de endpoints online: " + online_clients.length);
      online_clients.forEach(function(item,index){
        console.log("Cliente " + (index + 1) + " : " + item);
      });
    }

    if(enfermagem_stream){
      subscribeEnfermagem(session, enfermagem_stream);

      console.log("Total de endpoints online: " + online_clients.length);
      online_clients.forEach(function(item,index){
        console.log("Cliente " + (index + 1) + " : " + item);
      });
    }
  });

  session.on("streamDestroyed", function(event) {
    console.log("Stream destruido :" + event.stream.name);
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
}

function subscribeEnfermagem(session_obj, stream_obj){
  enfermagem_subscriber = session_obj.subscribe(stream_obj, 'subscriber', enfermagem_sub_options, handleError);  
}

function unsubscribeIntercom(){
  session.unsubscribe(intercom_subscriber);
}

function unsubscribeEnfermagem(session_obj){
  session_obj.unsubscribe(enfermagem_subscriber);
}

function setIntercomSpeaker(state){
  if(state == 'on'){

  }else{
    
  }
}

function setEnfermagemSpeaker(state){

}


// function subscribeIntercom(){
//   var stream;
//   session.streams.forEach( function(item,index){if(item.name == "intercom-unidade-3"){stream = item;} });
//   if(stream != null){
//     subscriber = session.getSubscribersForStream(stream);
//     subscriber[0].subscribeToAudio(true); 
//   }
// }

// function subscribeEnfermagem(){
//   var stream;
//   session.streams.forEach( function(item,index){if(item.name == "enfermagem-unidade-3"){stream = item;} });
//   if(stream != null){ 
//     subscriber = session.getSubscribersForStream(stream);
//     subscriber[0].subscribeToAudio(true); 
//   }
// }

function unsubscribeIntercom(){
  var stream;
  session.streams.forEach( function(item,index){if(item.name == "intercom-unidade-3"){stream = item;} });
  if(stream != null){
    subscriber = session.getSubscribersForStream(stream);
    subscriber[0].subscribeToAudio(false); 
  }
}

function unsubscribeEnfermagem(){
  var stream;
  session.streams.forEach( function(item,index){if(item.name == "enfermagem-unidade-3"){stream = item;} });
  if(stream != null){
    subscriber = session.getSubscribersForStream(stream);
    subscriber[0].subscribeToAudio(false); 
  }
}

function falarIntercom(){
  var connection;
  session.connections.forEach(function(item,index){if(item.data == "intercom") connection = item});
  session.signal({to: connection, data:"unmute"});
}

function falarEnfermagem(){
  var connection;
  session.connections.forEach(function(item,index){if(item.data == "enfermagem") connection = item});
  session.signal({to: connection, data:"unmute"});
}

function naofalarIntercom(){
  var connection;
  session.connections.forEach(function(item,index){if(item.data == "intercom") connection = item});
  session.signal({to: connection, data:"mute"});
}

function naofalarEnfermagem(){
  var connection;
  session.connections.forEach(function(item,index){if(item.data == "enfermagem") connection = item});
  session.signal({to: connection, data:"mute"});
}