<!DOCTYPE html>
<?php
$DATABASE_HOST = '18.230.68.85';
$DATABASE_USER = 'cetam';
$DATABASE_PASS = 'Spock1701a!';
$DATABASE_NAME = 'cetam';

$conn = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME) or die("Connection Error: " . mysqli_error($conn));
$result = mysqli_query($conn, "SELECT marca,modelo FROM maquinas");
?>
<html>
	<head>
		<meta charset="utf-8">
		<title>Login</title>
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
    <link href="css/login-page.css" rel="stylesheet" type="text/css">
	</head>
	<body>
		<div class="login">
			<h1>Gauss Command - CETAM</h1>
      <select name="dynamic_data">
      <?php
      $i=0;
      while($row = mysqli_fetch_array($result)) {
      ?>
      <option value="<?=$row["marca"];?>"><?=$row["marca"];?></option>
      <?php
      $i++;
      }
      ?>
      </select>
      <?php
      mysqli_close($conn);
      ?>
			<input type="submit" value="LOGIN">
		</div>
	</body>
</html>
