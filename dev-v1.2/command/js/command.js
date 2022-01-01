// replace these values with those generated in your TokBox Account
var apiKey = "47173734";
//var sessionId = "1_MX40NzE3MzczNH5-MTYzMTI5ODc4NjQ2OH40Z3QwTjJudXhXVHdndldXaWlRbklUNXl-fg";
//var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9ZjkxNzdlZDEzNzg4YmNmOWFjMzU4YzA2MzZkOGNiNjNhZTI0ZTAyMzpzZXNzaW9uX2lkPTFfTVg0ME56RTNNemN6Tkg1LU1UWXpNVEk1T0RjNE5qUTJPSDQwWjNRd1RqSnVkWGhYVkhkbmRsZFhhV2xSYmtsVU5YbC1mZyZjcmVhdGVfdGltZT0xNjMxOTA0NjgzJm5vbmNlPTAuNzQzNDkxMDY1MTc0NDA2NyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjM0NDk2NjgyJmNvbm5lY3Rpb25fZGF0YT1wYWQmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var publisher_intercom;
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
      width: '15%',
      height: '15%',
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
  publisher_intercom = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '15%',
    height: '15%',
    videoSource : null,
    name : "Command Center",
    echoCancellation : true,
    noiseSuppression : true,
    showControls : true
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




function subscribeIntercom(){
  var stream;
  session.streams.forEach( function(item,index){if(item.name == "intercom-unidade-3"){stream = item;} });
  if(stream != null){
    subscriber = session.getSubscribersForStream(stream);
    subscriber[0].subscribeToAudio(true); 
  }
}

function subscribeEnfermagem(){
  var stream;
  session.streams.forEach( function(item,index){if(item.name == "enfermagem-unidade-3"){stream = item;} });
  if(stream != null){ 
    subscriber = session.getSubscribersForStream(stream);
    subscriber[0].subscribeToAudio(true); 
  }
}

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