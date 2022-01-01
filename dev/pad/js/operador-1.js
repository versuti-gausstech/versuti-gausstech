var domain = 'jitsi.gausstech.io';

var room_name = 'Sala1';

// const re = new RegExp('.*[?&]' + 'room' + '=([^&#]*)'),
// match = ''.concat(document.location.href, window.location.hash).match(re);

// if (match) {
//     // We have to decode the URL since want the cleartext value
//     console.log(decodeURIComponent(match[1]));
//     room_name = match[1];
// }

const options_1 = {
    roomName: room_name,
    width: 400,
    height: 500,
    parentNode: document.querySelector('#operator-1'),
    configOverwrite: { startWithAudioMuted: true },
    disablePolls: false,
    avatarUrl : 'https://previews.123rf.com/images/aurora72/aurora721606/aurora72160600008/59282567-avatar-girl-operator-.jpg',
    interfaceConfigOverwrite: {TOOLBAR_BUTTONS: []},
    userInfo: {
        displayName: 'operador'
    }
};
const api_1 = new JitsiMeetExternalAPI(domain, options_1);

var chatPanel = false;
var mic = document.getElementById('btnMic_1');
var spk = document.getElementById('btnSpeaker_1');

mic.style.backgroundColor = 'red';
spk.style.backgroundColor = 'green';

api_1.on('videoConferenceJoined', function(e){
    console.log('entrei.');
    api_1.executeCommand('setTileView', true);
});

api_1.on('tileViewChanged', function(e){
    if(!e['enabled']){
        api_1.executeCommand('setTileView', true);
    }
});

api_1.on('mouseEnter', function(){
    //console.log('mouse na zona de iframe');
});

api_1.on('chatUpdated', function(e){
    chatPanel = e['isOpen'];
});

api_1.on('incomingMessage', function(){
    var chat = document.getElementById('btnChat_1');
    chat.style.backgroundColor = 'green';
});

api_1.on('audioMuteStatusChanged', function(status){
    var barraRaiseHand = document.getElementById('barraRaiseHand_1');
    var chamando = document.getElementById('chamando_1_1');
    var btnCall = document.getElementById('btnCall_1');

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


api_1.on('raiseHandUpdated', function(status){
    console.log("Mensagem de : ", status['id']);
    var barraRaiseHand = document.getElementById('barraRaiseHand_1');
    var chamando = document.getElementById('chamando_1');
    var btnCall = document.getElementById('btnCall_1');
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

function btnMic_1(){
    console.log("clicou no mic");
    var mic = document.getElementById('btnMic_1');
    if(mic.style.backgroundColor == 'green'){
        api_1.executeCommand('toggleAudio');
        mic.style.backgroundColor = 'red';
    }else{
        api_1.executeCommand('toggleAudio');
        mic.style.backgroundColor = 'green';        
    }
}

api_1.on('participantLeft', function(status){
    console.log('Enfermagem saiu : ', status['id']);
});
function btnSpk_1(id){
    var botao = document.getElementById(id);
    if(botao.style.backgroundColor == 'green'){
        speakerParticipant_1(true);
        botao.style.backgroundColor = 'red';
    }else{
        speakerParticipant_1(false);
        botao.style.backgroundColor = 'green';        
    }
}

function btnCall_1(){
    api_1.executeCommand('toggleRaiseHand')
}

function btnChat_1(id){
    var chat = document.getElementById(id);
    if(chatPanel){
        chat.style.backgroundColor = '';
        api_1.executeCommand('toggleChat');
    }else{
        chat.style.backgroundColor = 'green';
        api_1.executeCommand('toggleChat');
    }
}
function btnVideo_1(id){
    var video = document.getElementById(id);
    if(video.style.backgroundColor == ''){
        api_1.executeCommand('toggleVideo');
        video.style.backgroundColor = 'red';    
    }else{
        api_1.executeCommand('toggleVideo');
        video.style.backgroundColor = '';            
    }
}
function speakerParticipant_1(status){
    var participants = api_1.getParticipantsInfo();
    var participantID;
    participants.forEach(element => {
        if(element.displayName != 'operador'){
            participantID = element.participantId;
        }
    });
    if(status){
        api_1.executeCommand('setParticipantVolume', participantID, 0);
    }else{
        api_1.executeCommand('setParticipantVolume', participantID, 1);
    }
}