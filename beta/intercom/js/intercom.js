// replace these values with those generated in your TokBox Account
var apiKey = "47365281";
var sessionId = "2_MX40NzM2NTI4MX5-MTYzNTI2NTg2NDY1NX50cVRzcnNoZFQzSGpNWU9yZ0taczFTNnh-UH4";
var token = "T1==cGFydG5lcl9pZD00NzM2NTI4MSZzaWc9ZTk1NDkyNTgyZWI3ODhhMGRlMDczMjhiYWZhNWRlYjM0M2RlMzVlNDpzZXNzaW9uX2lkPTJfTVg0ME56TTJOVEk0TVg1LU1UWXpOVEkyTlRnMk5EWTFOWDUwY1ZSemNuTm9aRlF6U0dwTldVOXlaMHRhY3pGVE5uaC1VSDQmY3JlYXRlX3RpbWU9MTYzNTI2NTk1MCZub25jZT0wLjgxMDM2OTIzMzYyMzM5OTImcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzNzg1Nzk0MyZjb25uZWN0aW9uX2RhdGE9aW50ZXJjb20maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

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
initializeSession();

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    if(event.stream.name == "CommandCenter"){
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
  session.streams.forEach( function(item,index){if(item.name == "CommandCenter"){stream = item;} });
  sub = session.getSubscribersForStream(stream);
  sub[0].subscribeToAudio(true);
}

function unsubscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "CommandCenter"){stream = item;} });
  sub = session.getSubscribersForStream(stream);
  sub[0].subscribeToAudio(false);
}

function getRequest(url){
  fetch(url, {mode: 'cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function() {
    });
}