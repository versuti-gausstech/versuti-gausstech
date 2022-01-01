console.log(getCookie("screen_1"));
console.log(getCookie("screen_2"));
console.log(getCookie("screen_3"));

// if(getCookie("screen_1") != -1){
//   tela_1 = true;
// }else{
//   tela_1 = false;
// }

// if(getCookie("screen_2") != -1){
//   tela_2 = true;
// }else{
//   tela_2 = false;
// }

// if(getCookie("screen_3") != -1){
//   tela_3 = true;
// }else{
//   tela_3 = false;
// }

tela_1 = false;
tela_2 = false;
tela_3 = true;

//console.log("loading json file...");
var response = $.getJSON("json/estacao.json", function(json) {

// if(json.tela_1.enabled == "true") {  tela_1 = true ; }else{ tela_1 = false};
// if(json.tela_2.enabled == "true") {  tela_2 = true ; }else{ tela_2 = false};
// if(json.tela_3.enabled == "true") {  tela_3 = true ; }else{ tela_3 = false};

div_tela_1 = document.getElementById("div_tela_1");
div_tela_2 = document.getElementById("div_tela_2");
div_tela_3 = document.getElementById("div_tela_3");
div_central = document.getElementById("div_central");

botoes_tela_1 = document.getElementById("button_container1");
botoes_tela_2 = document.getElementById("button_container2");
botoes_tela_3 = document.getElementById("button_container3");

nome_unidade_1 = document.getElementById("nome_unidade_1");
nome_unidade_2 = document.getElementById("nome_unidade_2");
nome_unidade_3 = document.getElementById("nome_unidade_3");

nome_unidade_1.innerHTML = json.tela_1.nome_host;
nome_unidade_2.innerHTML = json.tela_2.nome_host;
nome_unidade_3.innerHTML = json.tela_3.nome_host;

// nome_unidade_1.innerHTML = getCookie("screen_1_marca") + " " + getCookie("screen_1_localizacao");
// nome_unidade_2.innerHTML = getCookie("screen_2_marca") + " " + getCookie("screen_2_localizacao");
// nome_unidade_3.innerHTML = getCookie("screen_3_marca") + " " + getCookie("screen_3_localizacao");

// screen1_intercom = getCookie("screen_1_intercom");
// screen2_intercom = getCookie("screen_2_intercom");
screen3_intercom = getCookie("screen_3_intercom");

if(tela_1){
  console.log("Tela 1 enabled");
  div_tela_1.style.visibility = "";
  botoes_tela_1.style.visibility = "";

}else{
  console.log("Tela 1 disabled");
  div_tela_1.remove();
  botoes_tela_1.remove();
}

if(tela_2){
  console.log("Tela 2 enabled");
  div_tela_2.style.visibility = "";
  botoes_tela_2.style.visibility = "";
}else{
  console.log("Tela 2 disabled");
  div_tela_2.remove();
  botoes_tela_2.remove();
}

if(tela_3){
  console.log("Tela 3 enabled");
  div_tela_3.style.visibility = "";
  botoes_tela_3.style.visibility = "";
}else{
  console.log("Tela 3 disabled");
  div_tela_3.remove();
  botoes_tela_3.remove();
}

if(tela_1 && tela_2 && tela_3){
  console.log("Todas as telas enabled.");

  div_tela_1.style.width = "33%";
  botoes_tela_1.style.width = "33%";

  div_tela_2.style.width = "33%";
  botoes_tela_2.style.width = "33%";

  div_tela_3.style.width = "33%";
  botoes_tela_3.style.width = "33%";
}
if(tela_1 && tela_2 && (! tela_3)){
  console.log("Telas 1 e 2 enabled.");

  div_tela_1.style.width = "48%";
  botoes_tela_1.style.width = "50%";

  div_tela_2.style.width = "48%";
  botoes_tela_2.style.width = "50%";

}
if(tela_1 && !tela_2 && tela_3){
  console.log("Telas 1 e 3 enabled.");

  div_tela_1.style.width = "45%";
  botoes_tela_1.style.width = "45%";

  div_tela_3.style.width = "45%";
  botoes_tela_3.style.width = "45%";
}
if(!tela_1 && tela_2 && tela_3){
  console.log("Telas 2 e 3 enabled.");

  div_tela_2.style.width = "48%";
  botoes_tela_2.style.width = "50%";

  div_tela_3.style.width = "48%";
  botoes_tela_3.style.width = "50%";
}

if(tela_1 && !tela_2 && !tela_3){
  console.log("Tela 1 enabled.");
  div_central.style.width = "100%";
  div_tela_1.style.width = "60%";
  
  botoes_tela_1.style.width = "40%";
}

if(!tela_1 && tela_2 && !tela_3){
  console.log("Tela 2 enabled.");
  div_tela_2.style.width = "60%";
  botoes_tela_2.style.width = "60%";
}

if(!tela_1 && !tela_2 && tela_3){
  console.log("Tela 3 enabled.");
  div_tela_3.style.width = "60%";
  botoes_tela_3.style.width = "60%";
}
});

//-------------------------------------
//mac = getCookie('screen_3_intercom');
mac = getCookie('screen_3_intercom');
rowPaciente = document.getElementById('rowPaciente_' + mac);
botaoIntercom = document.getElementById('botaoIntercom_' + mac);

barraIcones = document.createElement('td');
barraIcones.setAttribute('id', 'icones_' + mac);
barraIcones.setAttribute('style', 'text-align: center; vertical-align: middle;');
rowPaciente.append(barraIcones);

switchIntercom = document.createElement('input');
switchIntercom.setAttribute('id', 'chkIntercom_' + mac);
switchIntercom.setAttribute('type', 'checkbox');
switchIntercom.setAttribute('onclick', "audioIntercom(mac);");
switchIntercom.setAttribute('disabled', 'true');


span = document.createElement('span');
span.setAttribute('class', 'slider round');

botaoIntercom.append(switchIntercom);
botaoIntercom.append(span);

var micPaciente = document.createElement('i');
micPaciente.setAttribute('id', 'micIntercom_' + mac);
micPaciente.setAttribute('style', 'font-size:50px;color:white;padding: 3px;');
micPaciente.setAttribute('class', 'fas fa-microphone');

var mutarIntercom = document.createElement('i');
mutarIntercom.setAttribute('id', 'speakerIntercom_' + mac);
mutarIntercom.setAttribute('style', 'font-size:50px;color:white;padding: 3px;');
mutarIntercom.setAttribute('class', 'fas fa-volume-mute');
mutarIntercom.setAttribute('onclick', "speakerSwitch('cetam', 'intercom',getCookie('screen_3_intercom'))");

var audioStatus = document.createElement('i');
audioStatus.setAttribute('id', 'audioStatus_' + mac);
audioStatus.setAttribute('style', 'font-size:50px;color:grey;padding: 3px;');
audioStatus.setAttribute('class', 'fas fa-headset');

var bellPaciente = document.createElement('i');
bellPaciente.setAttribute('id', 'bellPacientes_' + mac);
bellPaciente.setAttribute('style', 'font-size:50px;color:white;padding: 3px;');
bellPaciente.setAttribute('class', 'fas fa-bell');

barraIcones.append(micPaciente);
barraIcones.append(mutarIntercom);
barraIcones.append(audioStatus);
barraIcones.append(bellPaciente);