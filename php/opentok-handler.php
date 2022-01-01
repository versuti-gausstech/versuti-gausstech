<?php
require "../vendor/autoload.php";

use OpenTok\OpenTok;


$apiKey = "47173734";
$apiSecret = "6289ab1054cdbe00d630e078cd5fc9e3d73f5e35";
$machineID = "unidade-3-philips";

$minhaSessao = getSession($apiKey, $apiSecret, $machineID);
echo $minhaSessao;
$fp = fopen('../json/session.json', 'w');
fwrite($fp, $minhaSessao);
fclose($fp);

function getSession($apiKey, $apiSecret, $machineID){
  $opentok = new OpenTok($apiKey, $apiSecret);

  // Create a session that attempts to use peer-to-peer streaming:
  $session = $opentok->createSession();
  // Store this sessionId in the database for later use
  $sessionId = $session->getSessionId();

  // Generate a Token from just a sessionId (fetched from a database)
  $token = $opentok->generateToken($sessionId);

  $mySession->session_id = $sessionId;
  $mySession->token = $token;
  $mySession->machine = $machineID;

  $mySessionJSON = json_encode($mySession);

  return $mySessionJSON;
}


 ?>
