var session;
var connectionCount = 0;

function connect(apiKey, sessionId, token) {
  // Replace apiKey and sessionId with your own values:
  session = OT.initSession(apiKey, sessionId);
  session.on({
    connectionCreated: function (event) {
      connectionCount++;
      console.log(connectionCount + ' connections.');
    },
    connectionDestroyed: function (event) {
      connectionCount--;
      console.log(connectionCount + ' connections.');
    },
    sessionDisconnected: function sessionDisconnectHandler(event) {
      // The event is defined by the SessionDisconnectEvent class
      console.log('Disconnected from the session.');
      //document.getElementById('disconnectBtn').style.display = 'none';
      if (event.reason == 'networkDisconnected') {
        alert('Your network connection terminated.')
      }
    }
  });
  // Replace token with your own value:
  session.connect(token, function(error) {
    if (error) {
      console.log('Unable to connect: ', error.message);
    } else {
      //document.getElementById('disconnectBtn').style.display = 'block';
      console.log('Connected to the session.');
      connectionCount = 1;
    }
  });
}

function disconnect() {
  session.disconnect();
}

