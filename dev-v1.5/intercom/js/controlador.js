function getRequest(url){
  fetch(url, {mode: 'no-cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      //console.log(data);
    }).catch(function() {
    });
}

// substitui o getRequest
function getJSON(URL){
  var json = {};
    $.ajax({
        url: URL,
        async: false,
        dataType: 'json',
        success: function(data) {
            json = data;
        }
    });
  return json;
}

function checkUpdatesFrontEnd_ON(element){
  mac_address = element.mac_address;
  status_mqtt = "statusMQTT_" + mac_address;
  mqtt_icon = document.getElementById(status_mqtt);
  if(mqtt_icon){
    mqtt_icon.style.color = "green";
  }
}

function checkUpdatesFrontEnd_OFF(element){
  mac_address = element.mac_address;
  status_mqtt = "statusMQTT_" + mac_address;
  mqtt_icon = document.getElementById(status_mqtt);
  if(mqtt_icon){
    mqtt_icon.style.color = "red";
  }
}

function checkUpdatesAudioON(element){
  mac_address = element.mac_address;
  status_audio = "statusAudio_" + mac_address;
  audio_icon = document.getElementById(status_audio);
  if(audio_icon){
    audio_icon.style.color = "green";
  }
}

function checkUpdatesAudioOFF(element){
  mac_address = element.mac_address;
  status_audio = "statusAudio_" + mac_address;
  audio_icon = document.getElementById(status_audio);
  if(audio_icon){
    audio_icon.style.color = "red";
  }
}



function updateIntercoms(){
  sendMessage("cetam/intercom/b827ebd97628/heartbeat", "get");
  sendMessage("cetam/intercom/b827eb3da438/heartbeat", "get");

  audio_online = getJSON(mqtt_api + "status/audio/online/");
  if(audio_online){
    try{
      audio_online.intercoms.forEach(checkUpdatesAudioON);
      console.log(audio_online);
    }catch(err){
      console.log("Erro:" + err.message);
    }
  }

  audio_offline = getJSON(mqtt_api + "status/audio/offline/");
  if(audio_offline){
    try{
      audio_offline.intercoms.forEach(checkUpdatesAudioOFF);
      console.log(audio_offline);
    }catch(err){
      console.log("Erro:" + err.message);
    }
  }
}