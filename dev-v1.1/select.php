<!DOCTYPE html>
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
    <div class="main">
      <br>
      <b><label style="color: white; font-size: x-large;">SELECIONE AS MAQUINAS DE SUA ESTACAO</label></b>
      <br><br><br>
      <div id="div_central" style="width: 100%; overflow: hidden;text-align: center; vertical-align: middle;color:white;">
        <div class="center" id="div_tela_1" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
          <b><label id="nome_unidade_1">TELA 1</label></b><br><br>
          <select name="tela1" id="tela1">
            <option value="none">Nenhuma</option>
            <option value="unidade1">MRI Philips Unidade 1</option>
            <option value="unidade3">MRI Philips Unidade 3</option>
            <option value="unidade2">MRI GE Unidade 2</option>
          </select>
          <br><br>
        </div>
  
        <div class="center" id="div_tela_2" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
          <b><label id="nome_unidade_2">TELA 2</label></b><br><br>
          <select name="tela2" id="tela2">
            <option value="none">Nenhuma</option>
            <option value="unidade1">MRI Philips Unidade 1</option>
            <option value="unidade3">MRI Philips Unidade 3</option>
            <option value="unidade2">MRI GE Unidade 2</option>
          </select>
          <br><br>
        </div>
  
        <div class="center" id="div_tela_3" style="background-color:#2f3947;width:30%;text-align: center; vertical-align: middle;border:1px solid white;">
          <b><label id="nome_unidade_3">TELA 3</label></b><br><br>
          <select name="tela3" id="tela3">
            <option value="none">Nenhuma</option>
            <option value="unidade1">MRI Philips Unidade 1</option>
            <option value="unidade3">MRI Philips Unidade 3</option>
            <option value="unidade2">MRI GE Unidade 2</option>
          </select>
          <br><br>
        </div>
      </div>

      <br><br>
      <div id="div_central" style="width: 100%; overflow: hidden;text-align: center; vertical-align: middle;color:white;">
        <div class="center" id="div_tela_1" style="background-color:#435165;width:30%;text-align: center; vertical-align: middle;border:0px solid white;">
        </div>
  
        <div class="center" id="div_tela_2" style="background-color:#435165;width:30%;text-align: center; vertical-align: middle;border:0px solid white;">
          <button class="button">INICIAR</button>
        </div>
  
        <div class="center" id="div_tela_3" style="background-color:#435165;width:30%;text-align: center; vertical-align: middle;border:0px solid white;">
        </div>
      </div>
    </div>
	</body>
</html>