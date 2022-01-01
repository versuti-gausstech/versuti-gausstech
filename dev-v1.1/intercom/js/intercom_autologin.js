var connected = false;

// replace these values with those generated in your TokBox Account
var apiKey = "47173734";
var sessionId = "1_MX40NzE3MzczNH5-MTYzMTI5ODc4NjQ2OH40Z3QwTjJudXhXVHdndldXaWlRbklUNXl-fg";
var token = "T1==cGFydG5lcl9pZD00NzE3MzczNCZzaWc9YWVkZWU5NWEwYTM2MDFkZDc0NThmNzA4MTFiMjY5MWJkOGQyYTdkZDpzZXNzaW9uX2lkPTFfTVg0ME56RTNNemN6Tkg1LU1UWXpNVEk1T0RjNE5qUTJPSDQwWjNRd1RqSnVkWGhYVkhkbmRsZFhhV2xSYmtsVU5YbC1mZyZjcmVhdGVfdGltZT0xNjMxMjk4OTgwJm5vbmNlPTAuMzg5MTIwNzA1NjI3MTA1NTUmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYzMTkwMzc4MCZjb25uZWN0aW9uX2RhdGE9aW50ZXJjb20maW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

let session = {created : false, id : ""};

// while(! session.created){

// }

check_new_session("unidade-3");

function getRequest(url){
  fetch(url, {mode: 'cors'}).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function() {
    });
}

function check_new_session(unidade){
  url = "https://cetam.gausstech.io:5000/connect/intercom/" + unidade + "/"; 
  response = getRequest(url);
  console.log(unidade);
  console.log(response);
  return true;
}