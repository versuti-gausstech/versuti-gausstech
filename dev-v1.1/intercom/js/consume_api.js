var apiKey = "47173734";
var sessionId = "1_MX40NzE3MzczNH5-MTYzMTI5ODc4NjQ2OH40Z3QwTjJudXhXVHdndldXaWlRbklUNXl-fg";
var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9YWVkZWU5NWEwYTM2MDFkZDc0NThmNzA4MTFiMjY5MWJkOGQyYTdkZDpzZXNzaW9uX2lkPTFfTVg0ME56RTNNemN6Tkg1LU1UWXpNVEk1T0RjNE5qUTJPSDQwWjNRd1RqSnVkWGhYVkhkbmRsZFhhV2xSYmtsVU5YbC1mZyZjcmVhdGVfdGltZT0xNjMxMjk4OTgwJm5vbmNlPTAuMzg5MTIwNzA1NjI3MTA1NTUmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzMTkwMzc4MCZjb25uZWN0aW9uX2RhdGE9aW50ZXJjb20maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

const axios = require('axios');
const https = require('https');
const { clearInterval } = require('timers');

const httpsAgent = new https.Agent({rejectUnauthorized: false});

url = 'https://cetam.gausstech.io:5000/status';

var mystream_name = "intercom-unidade-3";
var command_stream = "Command Center"
var count = 0;

function readJSON(){
  axios.get(url, { httpsAgent })
  .then(function (response) {
    isSessionOn(response.data);
    count++;
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });
}

var interval;
function isSessionOn(json){
  if(json.total_streams > 0){
    console.log("tem um stream ligado..");
    json.streams.forEach(element => { 
      if(element.name == command_stream) {
        console.log("Command Center esta online e servindo uma sessao");
        console.log("Session ID : " + json.session);
        clearInterval(interval);
        initializeSession();
        console.log("fim");
      }
    });
  }else{
    console.log("sem streams.");
  }
}

console.log("Iniciando leitura..");
interval = setInterval(readJSON, 2000);