<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
  <link rel="stylesheet" href="css/botoes.css">
  <link rel="stylesheet" href="css/config.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

  <style>
	.demo {
		border:1px solid #C0C0C0;
		border-collapse:collapse;
		padding:5px;
	}
	.demo th {
		border:1px solid #C0C0C0;
		padding:5px;
		background:#F0F0F0;
	}
	.demo td {
		border:1px solid #C0C0C0;
		padding:5px;
	}
</style>


</head>

<body>
  <div class="sidenav">
    <a href="intercom.html" style='font-size:50px;'><i class="fas fa-desktop" title="Home"></i></a>
    <a href="config.php" style='font-size:50px;'><i class="fas fa-cog" title="Configurar"></i></a>
    <a href="logout.php" style='font-size:50px;'><i class="fas fa-sign-out-alt" title="Sair"></i></a>
  </div>
  <div class="main">
    <?php
    $tela_1->enabled = $_GET['enabled_1'];
    $tela_2->enabled = $_GET['enabled_2'];
    $tela_3->enabled = $_GET['enabled_3'];

    if($tela_1->enabled != 'true'){ $tela_1->enabled = 'false' ;}
    if($tela_2->enabled != 'true'){ $tela_2->enabled = 'false' ;}
    if($tela_3->enabled != 'true'){ $tela_3->enabled = 'false' ;}

    $tela_1->nome_host = $_GET['nome_host1'];
    $tela_2->nome_host = $_GET['nome_host2'];
    $tela_3->nome_host = $_GET['nome_host3'];

    $tela_1->tipo_host = $_GET['tipo_host1'];
    $tela_2->tipo_host = $_GET['tipo_host2'];
    $tela_3->tipo_host = $_GET['tipo_host3'];

    $tela_1->marca_host = $_GET['marca_host1'];
    $tela_2->marca_host = $_GET['marca_host2'];
    $tela_3->marca_host = $_GET['marca_host3'];

    $tela_1->modelo_host = $_GET['modelo_host1'];
    $tela_2->modelo_host = $_GET['modelo_host2'];
    $tela_3->modelo_host = $_GET['modelo_host3'];

    $tela_1->ip_kvm_t = $_GET['ip_kvm_t1'];
    $tela_2->ip_kvm_t = $_GET['ip_kvm_t2'];
    $tela_3->ip_kvm_t = $_GET['ip_kvm_t3'];

    $tela_1->ip_kvm_r = $_GET['ip_kvm_r1'];
    $tela_2->ip_kvm_r = $_GET['ip_kvm_r2'];
    $tela_3->ip_kvm_r = $_GET['ip_kvm_r3'];

    $tela_1->ip_camera_paciente = $_GET['ip_camera_paciente1'];
    $tela_2->ip_camera_paciente = $_GET['ip_camera_paciente2'];
    $tela_3->ip_camera_paciente = $_GET['ip_camera_paciente3'];

    $tela_1->ip_camera_sala = $_GET['ip_camera_sala1'];
    $tela_2->ip_camera_sala = $_GET['ip_camera_sala2'];
    $tela_3->ip_camera_sala = $_GET['ip_camera_sala3'];

    $tela_1->ip_pad_intercom = $_GET['ip_pad_intercom1'];
    $tela_2->ip_pad_intercom = $_GET['ip_pad_intercom2'];
    $tela_3->ip_pad_intercom = $_GET['ip_pad_intercom3'];

    $tela_1->canal_freedom = $_GET['audio1'];
    $tela_2->canal_freedom = $_GET['audio2'];
    $tela_3->canal_freedom = $_GET['audio3'];

    $estacao->tela_1 = $tela_1;
    $estacao->tela_2 = $tela_2;
    $estacao->tela_3 = $tela_3;

    $estacao->nome = $_GET['nome_estacao'];
    $estacao->ip_pad_command = $_GET['ip_pad_command'];
    $estacao->ip_freedom = $_GET['ip_freedom'];

    $json_estacao = json_encode($estacao);
    file_put_contents('json/estacao.json', $json_estacao);
    header('Location: config.php');
    ?>
    <p>Dados salvos com sucesso!</p>
    <a href="config.php">Voltar</a>
  </div>
</body>

<script>

</script>
</html>