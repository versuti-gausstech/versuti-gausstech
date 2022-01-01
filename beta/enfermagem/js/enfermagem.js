// replace these values with those generated in your TokBox Account
var apiKey = "47365281";
var sessionId = "2_MX40NzM2NTI4MX5-MTYzNTI2NTg2NDY1NX50cVRzcnNoZFQzSGpNWU9yZ0taczFTNnh-UH4";
var token = "T1==cGFydG5lcl9pZD00NzM2NTI4MSZzaWc9ZGNhYThmNjMyN2Y2MGRmMjE0OGVjNTU3OGUwZWYxMWRiNDE0YWJhMzpzZXNzaW9uX2lkPTJfTVg0ME56TTJOVEk0TVg1LU1UWXpOVEkyTlRnMk5EWTFOWDUwY1ZSemNuTm9aRlF6U0dwTldVOXlaMHRhY3pGVE5uaC1VSDQmY3JlYXRlX3RpbWU9MTYzNTI2NTkzNSZub25jZT0wLjE2NTA4OTM3ODIwNzU3OTUyJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2Mzc4NTc5MjcmY29ubmVjdGlvbl9kYXRhPWVuZmVybWFnZW0maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var publisher_intercom;
var session;
var unidade = "unidade-3";
var subscriber;

var text = document.getElementById("txtCommandCenter");
initializeSession();


function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    if(event.stream.name == "CommandCenter"){
      session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        showControls: true
      }, handleError);
    }
    unsubscribeCC();
  });

  // Create a publisher
  publisher_intercom = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    videoSource : null,
    name : "enfermagem-" + unidade,
    echoCancellation : true,
    noiseSuppression : true,
    showControls: true
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
    var comando = event.data;
    if(event.type == unit){
      var items = comando.split(":");
      console.log(items);
      if(items[0] == "enfermagem" && items[1] == "speaker" && items[2] == "off"){
        unsubscribeCC();
        clickSpeaker();
      }
      if(items[0] == "enfermagem" && items[1] == "speaker" && items[2] == "on"){
        subscribeCC();
        clickSpeaker();
      }
    }else{
      var type = event.type.split(":");
      var from = type[1];
      var to = type[2];
      var comando = event.data;
      if(to == unidade){
        console.log("From: " + from + " To: " + to);
        console.log(comando);
        if(comando == "clear"){
          text.innerHTML = "";
        }else{
          text.innerHTML = comando;
          PlaySound("incoming-command");
        }
        
      }
    }

    // Process the event.data property, if there is any data.
  });
}

function subscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "CommandCenter"){stream = item;} });
  subscriber = session.getSubscribersForStream(stream);
  subscriber[0].subscribeToAudio(true);
}

function unsubscribeCC(){
  session.streams.forEach( function(item,index){if(item.name == "CommandCenter"){stream = item;} });
  subscriber = session.getSubscribersForStream(stream);
  subscriber[0].subscribeToAudio(false);
  console.log("unsubscribe");
}

function clickSpeaker(){
  var speaker = document.getElementById("bSpeaker");
  if(speaker.classList.contains('fa-volume-up')){
    speaker.classList.remove('fa-volume-up');
    speaker.classList.add('fa-volume-mute');
    speaker.style = "font-size:120px;color:red;";
    speaker.title = "Audio mutado";
    unsubscribeCC();
  }else{
    speaker.classList.remove('fa-volume-mute');
    speaker.classList.add('fa-volume-up');
    speaker.style = "font-size:120px;color:white;";
    speaker.title = "Audio desmutado";  
    subscribeCC();
  }
  
  }

function clickMic(){
  var mic = document.getElementById("bMic");
  if(mic.classList.contains('fa-microphone')){
    mic.classList.remove('fa-microphone');
    mic.classList.add('fa-microphone-slash');
    mic.style = "font-size:120px;color:red;";
    mic.title = "Audio mutado";
    publisher_intercom.publishAudio(false);
  }else{
    mic.classList.remove('fa-microphone-slash');
    mic.classList.add('fa-microphone');
    mic.style = "font-size:120px;color:white;";
    mic.title = "Audio desmutado";  
    publisher_intercom.publishAudio(true);
  }
}

function beep() {
  var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
  snd.play();
}

function PlaySound(soundObj) {
  var sound = document.getElementById(soundObj);
  sound.play();
}