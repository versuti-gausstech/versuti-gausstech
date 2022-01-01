var domain = 'jitsi.gausstech.io';

var room_name = 'Sala2';

// const re = new RegExp('.*[?&]' + 'room' + '=([^&#]*)'),
// match = ''.concat(document.location.href, window.location.hash).match(re);

// if (match) {
//     // We have to decode the URL since want the cleartext value
//     console.log(decodeURIComponent(match[1]));
//     room_name = match[1];
// }

const options_2 = {
    roomName: room_name,
    width: 400,
    height: 500,
    parentNode: document.querySelector('#operator-2'),
    configOverwrite: { startWithAudioMuted: true },
    disablePolls: false,
    avatarUrl : 'https://i.ebayimg.com/images/g/RfQAAOSwxbhe1oQX/s-l300.jpg',
    interfaceConfigOverwrite: {TOOLBAR_BUTTONS: []},
    userInfo: {
        displayName: 'operador'
    }
};
const api_2 = new JitsiMeetExternalAPI(domain, options_2);

var chatPanel = false;
var mic = document.getElementById('btnMic_2');
var spk = document.getElementById('btnSpeaker_2');

mic.style.backgroundColor = 'red';
spk.style.backgroundColor = 'green';

api_2.on('videoConferenceJoined', function(e){
    console.log('entrei.');
    api_2.executeCommand('setTileView', true);
});

api_2.on('tileViewChanged', function(e){
    if(!e['enabled']){
        api_2.executeCommand('setTileView', true);
    }
});

api_2.on('mouseEnter', function(){
    //console.log('mouse na zona de iframe');
});

api_2.on('chatUpdated', function(e){
    chatPanel = e['isOpen'];
});

api_2.on('incomingMessage', function(){
    var chat = document.getElementById('btnChat_2');
    chat.style.backgroundColor = 'green';
});

api_2.on('audioMuteStatusChanged', function(status){
    var barraRaiseHand = document.getElementById('barraRaiseHand_2');
    var chamando = document.getElementById('chamando_2');
    var btnCall = document.getElementById('btnCall_2');

    if(status['muted']){
        console.log('audio mutou');
    }else{
        console.log('audio desmutou');
        if(barraRaiseHand.style.backgroundColor == 'red'){
            barraRaiseHand.style.backgroundColor = '#2f3947';
            chamando.style.color = '#2f3947';
            btnCall.style.backgroundColor = '';
        }
    }
});


api_2.on('raiseHandUpdated', function(status){
    console.log("Mensagem de : ", status['id']);
    var barraRaiseHand = document.getElementById('barraRaiseHand_2');
    var chamando = document.getElementById('chamando_2');
    var btnCall = document.getElementById('btnCall_2');
    if(status['handRaised'] == 0){
        console.log("Baixou a mao");
        barraRaiseHand.style.backgroundColor = '';
        chamando.style.color = '#2f3947';
        btnCall.style.background = '';
    }else{
        console.log("Levantou a mao em : ", status['handRaised']);
        barraRaiseHand.style.backgroundColor = 'red';
        chamando.style.color = 'white';
        btnCall.style.background = 'red';
    }
});

function btnMic_2(id){
    console.log("clicou no mic");
    var mic = document.getElementById(id);
    if(mic.style.backgroundColor == 'green'){
        api_2.executeCommand('toggleAudio');
        mic.style.backgroundColor = 'red';
    }else{
        api_2.executeCommand('toggleAudio');
        mic.style.backgroundColor = 'green';        
    }
}

api_2.on('participantLeft', function(status){
    console.log('Enfermagem saiu : ', status['id']);
});
function btnSpk_2(id){
    var botao = document.getElementById(id);
    if(botao.style.backgroundColor == 'green'){
        speakerParticipant_2(true);
        botao.style.backgroundColor = 'red';
    }else{
        speakerParticipant_2(false);
        botao.style.backgroundColor = 'green';        
    }
}

function btnCall_2(){
    api_2.executeCommand('toggleRaiseHand')
}

function btnChat_2(id){
    var chat = document.getElementById(id);
    if(chatPanel){
        chat.style.backgroundColor = '';
        api_2.executeCommand('toggleChat');
    }else{
        chat.style.backgroundColor = 'green';
        api_2.executeCommand('toggleChat');
    }
}
function btnVideo_2(id){
    var video = document.getElementById(id);
    if(video.style.backgroundColor == ''){
        api_2.executeCommand('toggleVideo');
        video.style.backgroundColor = 'red';    
    }else{
        api_2.executeCommand('toggleVideo');
        video.style.backgroundColor = '';            
    }
}
function speakerParticipant_2(status){
    var participants = api_2.getParticipantsInfo();
    var participantID;
    participants.forEach(element => {
        if(element.displayName != 'operador'){
            participantID = element.participantId;
        }
    });
    if(status){
        api_2.executeCommand('setParticipantVolume', participantID, 0);
    }else{
        api_2.executeCommand('setParticipantVolume', participantID, 1);
    }
}