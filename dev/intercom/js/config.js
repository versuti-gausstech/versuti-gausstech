// Client data
var client_name = 'cetam';

// MQTT data
var host = "mqtt.gausstech.io";
var port = 9001;
let my_id = getCookie("my_id");
var mqtt_user = "mqtt-gauss";
var mqtt_pwd = "Spock1701a!;"

// API data
var mqtt_api = "https://api.gausstech.io:9091/";
var opentok_api = "https://api.gausstech.io:9090/";

// Opentok
var apiKey = "47173734";
var session_id;
var my_token;


function getRequest(url){
    fetch(url, {mode: 'no-cors'}).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
      }).catch(function() {
      });
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

  function buscaClientes() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  