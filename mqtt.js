const client = new Paho.MQTT.Client('54.233.72.238', 8001, 'myClientId' + new Date().getTime());
const myTopic = 'maquina-001/startscan';

client.connect({ onSuccess: onConnect })
let counter = 0
function onConnect() {
  console.log("connection successful")
  client.subscribe(myTopic)   //subscribe to our topic
}


const publish = (topic, msg) => {  //takes topic and message string
  let message = new Paho.MQTT.Message(msg);
  message.destinationName = topic;
  client.send(message);
}

client.onMessageArrived = onMessageArrived;
function onMessageArrived(message) {
  //let el= document.createElement('div')
  //el.innerHTML = message.payloadString
  //document.body.appendChild(el)
}

client.onConnectionLost = onConnectionLost;

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  client.connect({ onSuccess: onConnect });
}
