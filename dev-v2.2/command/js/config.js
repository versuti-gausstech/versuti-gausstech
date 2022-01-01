// Client data
var client_name = 'cetam';

// MQTT data
var host = "mqtt.gausstech.io";
var port = 9001;
let my_id = getCookie("my_id");
var mqtt_user = "mqtt-gauss";
var mqtt_pwd = "Spock1701a!;"

// topics
var command_topic = client_name + '/commandcenter/' + my_id + '/#';
var intercom_topic = client_name + '/intercom/' + my_id + '/#';

// Opentok
var apiKey = "47173734";
var commandcenter_name = my_id;

var commandcenter_pub_options = { 
    publishAudio: true, 
    publishVideo:false,
    insertMode: 'append',
    width: '15%',
    height: '15%',
    name : "CommandCenter-" + commandcenter_name
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

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }