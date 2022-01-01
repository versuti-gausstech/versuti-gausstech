var domain = 'jitsi.gausstech.io';
const options = {
    roomName: 'cetam',
    parentNode: document.querySelector('#intercom'),
    avatarUrl : 'https://png.pngtree.com/png-vector/20200210/ourlarge/pngtree-mri-scanner-magnetic-resonance-imaging-of-body-medicine-diagnostic-concept-flat-png-image_2143663.jpg',
    interfaceConfigOverwrite: {TOOLBAR_BUTTONS: ['microphone','camera' , 'fullscreen', 'chat', 'tileview']},
    userInfo: {
        displayName: 'intercom'
    }
};
const api = new JitsiMeetExternalAPI(domain, options);

console.log("Mudando para tile view");
api.executeCommand('setTileView',  true);
console.log("feito");
switchMic();

api.addListener('toolbarButtonClicked', () => {console.log('teste')});

// api.executeCommands({
//     'overwriteConfig' : [{toolbarButtons : ['microphone', 'camera']}],
//     'setTileView' : [true],
//     'toggleAudio' : []
// });

function switchMic(){
    api.executeCommand('toggleAudio');
}

function speakerParticipant(id, status){
    if(status){
        api.executeCommand('setParticipantVolume', id, 0);
    }else{
        api.executeCommand('setParticipantVolume', id, 1);
    }
}