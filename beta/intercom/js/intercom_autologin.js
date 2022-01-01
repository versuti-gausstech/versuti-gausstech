// replace these values with those generated in your TokBox Account
var apiKey = "47173734";
var sessionId = "1_MX40NzE3MzczNH5-MTYzMTI5ODc4NjQ2OH40Z3QwTjJudXhXVHdndldXaWlRbklUNXl-fg";
var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9YWVkZWU5NWEwYTM2MDFkZDc0NThmNzA4MTFiMjY5MWJkOGQyYTdkZDpzZXNzaW9uX2lkPTFfTVg0ME56RTNNemN6Tkg1LU1UWXpNVEk1T0RjNE5qUTJPSDQwWjNRd1RqSnVkWGhYVkhkbmRsZFhhV2xSYmtsVU5YbC1mZyZjcmVhdGVfdGltZT0xNjMxMjk4OTgwJm5vbmNlPTAuMzg5MTIwNzA1NjI3MTA1NTUmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzMTkwMzc4MCZjb25uZWN0aW9uX2RhdGE9aW50ZXJjb20maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var publisher_intercom;
var session;

$(function(){
  setInterval(oneSecondFunction, 10000);
  });

function oneSecondFunction() {
  // stuff you want to do every second
  var json = {};
  $.ajax({
      url: "https://api.gausstech.io:5000/robos/",
      async: false,
      dataType: 'json',
      success: function(data) {
          json = data;
      }
  });
  console.log(json['results']);
}


initializeSession();

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    if(event.stream.name == "Command Center"){
      session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '20%',
        height: '20%'
      }, handleError);
    }
    unsubscribeCC();
  });

  session.on("sessionDisconnected", function(event) {
    console.log("The session disconnected. " + event.reason);
});

  // Create a publisher
  publisher_intercom = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '20%',
    height: '20%',
    videoSource : null,
    name : "intercom-unidade-3",
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

function subscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "Command Center"){stream = item;} });
  sub = session.getSubscribersForStream(stream);
  sub[0].subscribeToAudio(true);
}

function unsubscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "Command Center"){stream = item;} });
  sub = session.getSubscribersForStream(stream);
  sub[0].subscribeToAudio(false);
}