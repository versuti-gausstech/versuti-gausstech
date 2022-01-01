var domain = 'jitsi.gausstech.io';

var room_name = '';

const re = new RegExp('.*[?&]' + 'room' + '=([^&#]*)'),
match = ''.concat(document.location.href, window.location.hash).match(re);

if (match) {
    // We have to decode the URL since want the cleartext value
    console.log(decodeURIComponent(match[1]));
    room_name = match[1];
}

const options = {
    roomName: room_name,
    width: 400,
    height: 500,
    parentNode: document.querySelector('#operator'),
    configOverwrite: { startWithAudioMuted: true },
    disablePolls: false,
    avatarUrl : 'https://previews.123rf.com/images/aurora72/aurora721606/aurora72160600008/59282567-avatar-girl-operator-.jpg',
    interfaceConfigOverwrite: {TOOLBAR_BUTTONS: []},
    userInfo: {
        displayName: 'operador'
    }
};
const api = new JitsiMeetExternalAPI(domain, options);

var chatPanel = false;
var mic = document.getElementById('btnMic');
var spk = document.getElementById('btnSpeaker');

mic.style.backgroundColor = 'red';
spk.style.backgroundColor = 'green';

api.on('videoConferenceJoined', function(e){
    console.log('entrei.');
    api.executeCommand('setTileView', true);
});

api.on('tileViewChanged', function(e){
    if(!e['enabled']){
        api.executeCommand('setTileView', true);
    }
});

api.on('mouseEnter', function(){
    //console.log('mouse na zona de iframe');
});

api.on('chatUpdated', function(e){
    chatPanel = e['isOpen'];
});

api.on('incomingMessage', function(){
    var chat = document.getElementById('btnChat');
    chat.style.backgroundColor = 'green';
});

api.on('audioMuteStatusChanged', function(status){
    var barraRaiseHand = document.getElementById('barraRaiseHand');
    var chamando = document.getElementById('chamando');
    var btnCall = document.getElementById('btnCall');

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


api.on('raiseHandUpdated', function(status){
    console.log("Mensagem de : ", status['id']);
    var barraRaiseHand = document.getElementById('barraRaiseHand');
    var chamando = document.getElementById('chamando');
    var btnCall = document.getElementById('btnCall');
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

function btnMic(){
    console.log("clicou no mic");
    var mic = document.getElementById('btnMic');
    if(mic.style.backgroundColor == 'green'){
        api.executeCommand('toggleAudio');
        mic.style.backgroundColor = 'red';
    }else{
        api.executeCommand('toggleAudio');
        mic.style.backgroundColor = 'green';        
    }
}

api.on('participantLeft', function(status){
    console.log('Enfermagem saiu : ', status['id']);
});
function btnSpk(){
    var botao = document.getElementById('btnSpeaker');
    if(botao.style.backgroundColor == 'green'){
        speakerParticipant(true);
        botao.style.backgroundColor = 'red';
    }else{
        speakerParticipant(false);
        botao.style.backgroundColor = 'green';        
    }
}

function btnCall(){
    api.executeCommand('toggleRaiseHand')
}

function btnChat(){
    var chat = document.getElementById('btnChat');
    if(chatPanel){
        chat.style.backgroundColor = '';
        api.executeCommand('toggleChat');
    }else{
        chat.style.backgroundColor = 'green';
        api.executeCommand('toggleChat');
    }
}
function btnVideo(){
    var video = document.getElementById('btnVideo');
    if(video.style.backgroundColor == ''){
        api.executeCommand('toggleVideo');
        video.style.backgroundColor = 'red';    
    }else{
        api.executeCommand('toggleVideo');
        video.style.backgroundColor = '';            
    }
}
function speakerParticipant(status){
    var participants = api.getParticipantsInfo();
    var participantID;
    participants.forEach(element => {
        if(element.displayName != 'operador'){
            participantID = element.participantId;
        }
    });
    if(status){
        api.executeCommand('setParticipantVolume', participantID, 0);
    }else{
        api.executeCommand('setParticipantVolume', participantID, 1);
    }
}