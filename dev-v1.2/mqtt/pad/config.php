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
    <a href="index.html" style='font-size:50px;'><i class="fas fa-desktop" title="Home"></i></a>
    <a href="config.php" style='font-size:50px;'><i class="fas fa-cog" title="Configurar"></i></a>
    <a href="logout.php" style='font-size:50px;'><i class="fas fa-sign-out-alt" title="Sair"></i></a>
  </div>
  <div class="main">
  <?php
  $str = file_get_contents("json/estacao.json");
  $json = json_decode($str, true);
  

?>
    <h2 style="text-align:left;">Configurar Estação de Trabalho : <?php echo($json['nome']); ?></h2>
    
    <h3 style="text-align:left;">Máquinas Remotas</h2>

<form action="salvar.php">
<table class="demo">
	<caption></caption>	<thead>	<tr>		<th>Item</th>
		<th>Host Remoto 1</th>
		<th>Host Remoto 2</th>
		<th>Host Remoto 3</th>
	</tr>	</thead>	<tbody>	
  
  <tr>
		<td>Adicionar à estação de trabalho</td>
		<td><input type="checkbox" id="enabled_1" name="enabled_1" value="true" <?php if($json['tela_1']['enabled'] == 'true'){echo('checked');} ?>></td>
		<td><input type="checkbox" id="enabled_2" name="enabled_2" value="true" <?php if($json['tela_2']['enabled'] == 'true'){echo('checked');} ?>></td>
		<td><input type="checkbox" id="enabled_3" name="enabled_3" value="true" <?php if($json['tela_3']['enabled'] == 'true'){echo('checked');} ?>></td>
	</tr>

  <tr>
		<td>Nome identificador:</td>
		<td><input type="text" value="<?php echo($json['tela_1']['nome_host']); ?>" id="nome_host1" name="nome_host1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['nome_host']); ?>" id="nome_host2" name="nome_host2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['nome_host']); ?>" id="nome_host3" name="nome_host3"></td>
	</tr>

  <tr>
		<td>Tipo do equipamento</td>
		<td><input type="text" value="<?php echo($json['tela_1']['tipo_host']); ?>" id="tipo_host1" name="tipo_host1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['tipo_host']); ?>" id="tipo_host2" name="tipo_host2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['tipo_host']); ?>" id="tipo_host3" name="tipo_host3"></td>
	</tr>

  <tr>
		<td>Marca</td>
		<td><input type="text" value="<?php echo($json['tela_1']['marca_host']); ?>" id="marca_host1" name="marca_host1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['marca_host']); ?>" id="marca_host2" name="marca_host2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['marca_host']); ?>" id="marca_host3" name="marca_host3"></td>
	</tr>
  <tr>
		<td>Modelo</td>
		<td><input type="text" value="<?php echo($json['tela_1']['modelo_host']); ?>" id="modelo_host1" name="modelo_host1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['modelo_host']); ?>" id="modelo_host2" name="modelo_host2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['modelo_host']); ?>" id="modelo_host3" name="modelo_host3"></td>
	</tr>
  <tbody>
</table>
<br>

<h3 style="text-align:left;">Equipamentos de Transmissão</h2>
<table class="demo">
	<caption></caption>	<thead>	<tr>		<th>Item</th>
		<th>Host Remoto 1</th>
		<th>Host Remoto 2</th>
		<th>Host Remoto 3</th>
	</tr>	</thead>	<tbody>	
  <tr>
		<td>IP KVM Transmissor</td>
		<td><input type="text" value="<?php echo($json['tela_1']['ip_kvm_t']); ?>" id="ip_kvm_t1" name="ip_kvm_t1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['ip_kvm_t']); ?>" id="ip_kvm_t2" name="ip_kvm_t2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['ip_kvm_t']); ?>" id="ip_kvm_t3" name="ip_kvm_t3"></td>
	</tr>
	<tr>
		<td>IP KVM Receptor</td>
		<td><input type="text" value="<?php echo($json['tela_1']['ip_kvm_r']); ?>" id="ip_kvm_r1" name="ip_kvm_r1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['ip_kvm_r']); ?>" id="ip_kvm_r2" name="ip_kvm_r2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['ip_kvm_r']); ?>" id="ip_kvm_r3" name="ip_kvm_r3"></td>
	</tr>
	<tr>
		<td>IP Câmera Paciente</td>
    <td><input type="text" value="<?php echo($json['tela_1']['ip_camera_paciente']); ?>" id="ip_camera_paciente1" name="ip_camera_paciente1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['ip_camera_paciente']); ?>" id="ip_camera_paciente2" name="ip_camera_paciente2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['ip_camera_paciente']); ?>" id="ip_camera_paciente3" name="ip_camera_paciente3"></td>
	</tr>
	<tr>
		<td>IP Câmera Sala</td>
    <td><input type="text" value="<?php echo($json['tela_1']['ip_camera_sala']); ?>" id="ip_camera_sala1" name="ip_camera_sala1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['ip_camera_sala']); ?>" id="ip_camera_sala2" name="ip_camera_sala2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['ip_camera_sala']); ?>" id="ip_camera_sala3" name="ip_camera_sala3"></td>
	</tr>
  <tbody>
</table>
<br>

<h3 style="text-align:left;">Áudio</h2>
<table class="demo">
	<caption></caption>	<thead>	<tr>		<th>Item</th>
		<th>Host Remoto 1</th>
		<th>Host Remoto 2</th>
		<th>Host Remoto 3</th>
	</tr>	</thead>	<tbody>	

	<tr>
		<td>IP Gauss Pad Intercom</td>
    <td><input type="text" value="<?php echo($json['tela_1']['ip_pad_intercom']); ?>" id="ip_pad_intercom1" name="ip_pad_intercom1"></td>
		<td><input type="text" value="<?php echo($json['tela_2']['ip_pad_intercom']); ?>" id="ip_pad_intercom2" name="ip_pad_intercom2"></td>
		<td><input type="text" value="<?php echo($json['tela_3']['ip_pad_intercom']); ?>" id="ip_pad_intercom3" name="ip_pad_intercom3"></td>
	</tr>
  <tr>
		<td>Saída de áudio remoto</td>
    <td>
      <select name="audio1" id="audio1">
        <option value="saida1">Placa USB 1</option>
        <option value="saida2">Placa USB 2</option>
        <option value="saida3">Placa USB 3</option>
      </select>
    </td>
		<td>
    <select name="audio1" id="audio1">
        <option value="saida1">Placa USB 1</option>
        <option value="saida2">Placa USB 2</option>
        <option value="saida3">Placa USB 3</option>
      </select>
    </td>
		<td>
    <select name="audio1" id="audio1">
        <option value="saida1">Placa USB 1</option>
        <option value="saida2">Placa USB 2</option>
        <option value="saida3">Placa USB 3</option>
      </select>
    </td>
	</tr>

  <tr>
		<td>Canal do Freedom (local)</td>
    <td>
      <select name="audio1" id="audio1">
        <option value="0" <?php if($json['tela_1']['canal_freedom'] == '0'){ echo ('selected');} ?>>N/A</option>
        <option value="1" <?php if($json['tela_1']['canal_freedom'] == '1'){ echo ('selected');} ?>>Canal 1</option>
        <option value="2" <?php if($json['tela_1']['canal_freedom'] == '2'){ echo ('selected');} ?>>Canal 2</option>
        <option value="3" <?php if($json['tela_1']['canal_freedom'] == '3'){ echo ('selected');} ?>>Canal 3</option>
        <option value="4" <?php if($json['tela_1']['canal_freedom'] == '4'){ echo ('selected');} ?>>Canal 4</option>
      </select>
    </td>
		<td>
    <select name="audio2" id="audio2">
        <option value="0" <?php if($json['tela_2']['canal_freedom'] == '0'){ echo ('selected');} ?>>N/A</option>
        <option value="1" <?php if($json['tela_2']['canal_freedom'] == '1'){ echo ('selected');} ?>>Canal 1</option>
        <option value="2" <?php if($json['tela_2']['canal_freedom'] == '2'){ echo ('selected');} ?>>Canal 2</option>
        <option value="3" <?php if($json['tela_2']['canal_freedom'] == '3'){ echo ('selected');} ?>>Canal 3</option>
        <option value="4" <?php if($json['tela_2']['canal_freedom'] == '4'){ echo ('selected');} ?>>Canal 4</option>
    </select>
    </td>
		<td>
    <select name="audio3" id="audio3">
        <option value="0" <?php if($json['tela_3']['canal_freedom'] == '0'){ echo ('selected');} ?>>N/A</option>
        <option value="1" <?php if($json['tela_3']['canal_freedom'] == '1'){ echo ('selected');} ?>>Canal 1</option>
        <option value="2" <?php if($json['tela_3']['canal_freedom'] == '2'){ echo ('selected');} ?>>Canal 2</option>
        <option value="3" <?php if($json['tela_3']['canal_freedom'] == '3'){ echo ('selected');} ?>>Canal 3</option>
        <option value="4" <?php if($json['tela_3']['canal_freedom'] == '4'){ echo ('selected');} ?>>Canal 4</option>
      </select>
    </td>
	</tr>
  
	<tbody>
</table>
<br>

<h3 style="text-align:left;">Command Center</h2>
<table class="demo">
	<caption></caption>	<thead>	<tr>		<th>Item</th>
		<th>Command Center</th>
	</tr>	</thead>	
  <tbody>	
  <tr>
		<td>Nome da estação</td>
		<td><input type="text" value="<?php echo($json['nome']); ?>" id="nome_estacao" name="nome_estacao"></td>
	</tr>
  <tr>
		<td>IP Gauss Pad Command</td>
		<td><input type="text" value="<?php echo($json['ip_pad_command']); ?>" id="ip_pad_command" name="ip_pad_command"></td>
	</tr>
  <tr>
		<td>IP Freedom</td>
		<td><input type="text" value="<?php echo($json['ip_freedom']); ?>" id="ip_freedom" name="ip_freedom"></td>
	</tr>
	<tbody>
</table>
<input type="submit" value="Submit">
</form> 
  </div>

</body>

<script>

</script>
</html>