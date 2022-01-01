// replace these values with those generated in your TokBox Account
var apiKey = "47173734";
var sessionId = "1_MX40NzE3MzczNH5-MTYzMTI5ODc4NjQ2OH40Z3QwTjJudXhXVHdndldXaWlRbklUNXl-fg";
var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9NTY1ODNiOWQxN2MzYmRiNDQxZGNmMzIyMDE0Y2M0OTc3YmUzMWNkOTpzZXNzaW9uX2lkPTFfTVg0ME56RTNNemN6Tkg1LU1UWXpNVEk1T0RjNE5qUTJPSDQwWjNRd1RqSnVkWGhYVkhkbmRsZFhhV2xSYmtsVU5YbC1mZyZjcmVhdGVfdGltZT0xNjMxMjk5MDE4Jm5vbmNlPTAuNjc0NzA1NzI2NDQ2NTI5NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjMxOTAzODE4JmNvbm5lY3Rpb25fZGF0YT1wYWQmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var publisher_intercom;
var session;
var thesubscriber;

subscriber = [];
var stream;
s = [];


initializeSession();


function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    thesubscriber = session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '15%',
      height: '15%',
      showControls : false
    }, handleError);
    console.log("Novo stream criado: ");
    thesubscriber.setStyle('backgroundImageURI','https://tokbox.com/img/styleguide/tb-colors-cream.png');
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
    showControls : false
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
}