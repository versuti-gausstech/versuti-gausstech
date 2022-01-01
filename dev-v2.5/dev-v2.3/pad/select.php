<!DOCTYPE html>
<?php
session_start();

//error_reporting(E_ALL);
error_reporting(0); 

ini_set('display_errors', 'On');

// se o usuario nao estiver logado, volta pra pagina de logar
if (!isset($_SESSION['loggedin'])) {
	header('Location: ../../index.html');
	exit;
}


$DATABASE_HOST = '54.94.113.166';
$DATABASE_USER = 'cetam';
$DATABASE_PASS = 'Spock1701a!';
$DATABASE_NAME = 'cetam';

$maquinas = array();

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	// If there is an error with the connection, stop the script and display the error.
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

// Prepare our SQL, preparing the SQL statement will prevent SQL injection.
if ($stmt = $con->prepare('SELECT id, intercom_id, marca, modelo, tipo, localizacao FROM maquinas WHERE enabled=1')) {
	// Bind parameters (s = string, i = int, b = blob, etc), in our case the username is a string so we use "s"
	//$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	// Store the result so we can check if the account exists in the database.
	$stmt->store_result();

  if ($stmt->num_rows > 0) {
    $stmt->bind_result($id, $intercom_id, $marca, $modelo, $tipo, $localizacao);
//  	$stmt->fetch();
    while($stmt->fetch()){
      $data = array("id" => $id, "intercom_id" => $intercom_id, "marca" => $marca, "modelo" => $modelo, "localizacao" => $localizacao);
      array_push($maquinas, $data);
      //echo("<option value='" . $localizacao . "'>" . $tipo . " " . $marca . " " . $localizacao . "</option>");
      //printf("%s (%s)\n", $marca, $tipo);
    }

  }
}

?>

<html>
	<head>
		<meta charset="utf-8">
		<link rel="icon" type="image/png" href="/favicon.png"/>

		<title>CETAM - Gauss Command</title>
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
    <link href="https://cetam.gausstech.io/css/login-page.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="pad/css/botoes.css">

    <style>
      .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
      }
      </style>
	</head>
	<body>
    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="post">

    <div class="main">
      <br>
      <b><label style="color: white; font-size: x-large;"><?php echo($_COOKIE["name"] . ",")?> selecione as máquinas para operação.</label></b>
      <br><br><br>
      <div id="div_central" style="width: 100%; overflow: hidden;text-align: center; vertical-align: middle;color:white;">
        <div class="center" id="div_tela_1" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
          <b><label id="nome_unidade_1">TELA 1</label></b><br><br>
          <select name="tela1" id="tela1">
            <option value="-1">Nenhuma</option>
            <?php
              $id = 0;
              foreach ($maquinas as $maquina){
                echo("<option value='" . $id . "'>" . $maquina->tipo . " " . $maquina['marca'] . " " . $maquina['localizacao'] . "</option>");
                $id += 1;
              }
            ?>
          </select>
          <br><br>
        </div>
  
        <div class="center" id="div_tela_2" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
          <b><label id="nome_unidade_2">TELA 2</label></b><br><br>
          <select name="tela2" id="tela2">
          <option value="-1">Nenhuma</option>
            <?php
              $id = 0;
              foreach ($maquinas as $maquina){
                echo("<option value='" . $id . "'>" . $maquina->tipo . " " . $maquina['marca'] . " " . $maquina['localizacao'] . "</option>");
                $id += 1;
              }
            ?>
          </select>
          <br><br>
        </div>
  
        <div class="center" id="div_tela_3" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
          <b><label id="nome_unidade_3">TELA 3</label></b><br><br>
          <select name="tela3" id="tela3">
            <option value="-1">Nenhuma</option>
            <?php
              $id = 0;
              foreach ($maquinas as $maquina){
                echo("<option value='" . $id . "'>" . $maquina->tipo . " " . $maquina['marca'] . " " . $maquina['localizacao'] . "</option>");
                $id += 1;
              }
            ?>
          </select>
          <br><br>
        </div>
      </div>

      <br><br>
      <div id="div_central" style="width: 100%; overflow: hidden;text-align: center; vertical-align: middle;color:white;">
        <div class="center" id="div_tela_1" style="background-color:#435165;width:30%;text-align: center; vertical-align: middle;border:0px solid white;">
        </div>
  
        <div class="center" id="div_tela_2" style="background-color:#435165;width:30%;text-align: center; vertical-align: middle;border:0px solid white;">
          <!-- <form method="post">   -->
            <button class="button" name="button1" type="submit">INICIAR</button>
          <!-- </form> -->
        </div>
  
        <div class="center" id="div_tela_3" style="background-color:#435165;width:30%;text-align: center; vertical-align: middle;border:0px solid white;">
        </div>
      </div>
      <?php 
        if(isset($_POST["button1"])){
          
          $screen_order = array($_POST['tela1'], $_POST['tela2'], $_POST['tela3']);
          print_r($screen_order);
          $tela1_index = $_POST['tela1'];
          $tela2_index = $_POST['tela2'];
          $tela3_index = $_POST['tela3'];

          setcookie("screen_1", $tela1_index);
          setcookie("screen_2", $tela2_index);
          setcookie("screen_3", $tela3_index);
          
          if($tela1_index != -1){
            setcookie("screen_1_marca", $maquinas[$tela1_index]['marca']);
            setcookie("screen_1_modelo", $maquinas[$tela1_index]['modelo']);
            setcookie("screen_1_localizacao", $maquinas[$tela1_index]['localizacao']);

            setcookie("screen_1_intercom", $maquinas[$tela1_index]['intercom_id']);
          }else{
            setcookie("screen_1_marca", "");
            setcookie("screen_1_modelo", "");
            setcookie("screen_1_localizacao", "");

            setcookie("screen_1_intercom", "");
          }

          if($tela2_index != -1){
            setcookie("screen_2_marca", $maquinas[$tela2_index]['marca']);
            setcookie("screen_2_modelo", $maquinas[$tela2_index]['modelo']);
            setcookie("screen_2_localizacao", $maquinas[$tela2_index]['localizacao']);

            setcookie("screen_2_intercom", $maquinas[$tela2_index]['intercom_id']);
          }else{
            setcookie("screen_2_marca", "");
            setcookie("screen_2_modelo", "");
            setcookie("screen_2_localizacao", "");

            setcookie("screen_2_intercom", "");
          }

          if($tela3_index != -1){
            setcookie("screen_3_marca", $maquinas[$tela3_index]['marca']);
            setcookie("screen_3_modelo", $maquinas[$tela3_index]['modelo']);
            setcookie("screen_3_localizacao", $maquinas[$tela3_index]['localizacao']);

            setcookie("screen_3_intercom", $maquinas[$tela3_index]['intercom_id']);
          }else{
            setcookie("screen_3_marca", "");
            setcookie("screen_3_modelo", "");
            setcookie("screen_3_localizacao", "");

            setcookie("screen_3_intercom", "");
          }

          header('Location: https://cetam.gausstech.io/dev/pad/index.php');
        } 
      ?>
    </div>
    </form>
	</body>
</html>