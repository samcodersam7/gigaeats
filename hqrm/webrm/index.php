<?PHP
/*----------------------------------------------------------------------*/
/* File name	: index.php																*/
/* Function		: Check license valid , browser support and ID request	*/
/* Program by	: Ding																	*/
/* Date			: 01/02/2005															*/
/*----------------------------------------------------------------------*/
session_start();
//require_once('/home/webrm/m/mobilize.php');
//if ( (file_exists(dirname(__FILE__)."/Example/default.php" )) && !($_GET['id']) && !($_SESSION['chkLog'])) {
//	header("location:Example/default.php");
//}

if(empty($_GET['Action'])){
	$disHOLogin="hidden";
}
else{
	$disComp="hidden";
}

## CONNECT DATABASE
include('script/conDatabase.php');
## IF EMPTY NO USER AT DATABASE THEN LINK TO WEBRM
$_SESSION['conDatabase'] = "conDatabase.php";
//$content = "../modules/help/about/about.php";
$_SESSION['moduleFolder'] = "modules";
$title = 'WebRM';

//Epul edit
$ip = $_SERVER["REMOTE_ADDR"];

## end of tracking Ip and Mac adress ##
## IF EMPTY NO USER AT DATABASE AND NO WEBRM DATABASE THEN LINK TO HQRM
if (!mysql_select_db($myDBName)){
	include('script/cHQDatabase.php');
	mysql_select_db($myDBName);
//	$content = "../hqmodules/help/about/about.php";
	$_SESSION['conDatabase'] = "conHQDatabase.php";
	$_SESSION['moduleFolder'] = "hqmodules";
	$title = 'HQRM';

}

$content = "../main/content.php";
	
if (empty($_SESSION['chkQua'])){
	$_SESSION['chkQua'] = 'OK';
	//include('script/chkQua.js');
}


$strComp = "select * from Company";
$resultComp = mysql_query($strComp,$link_ID);
$objComp = mysql_fetch_object($resultComp);


if(empty($_SESSION['CompCode']) && !empty($_GET['CompCode'])){
	$_SESSION['CompCode']=$_GET['CompCode'];
	$objComp->CompCode =$_GET['CompCode']; 
}

//Saiful Edit 16/10/2018
$ObjSysParam = GET_SYSPARAM_SETTING('%');
$ChkPassAttempt=$ObjSysParam->ChkPassAttempt; 

CHECK_VERSION($objComp->CustCode);

/*
if ($RegStatus == 'N' ) {
	mysql_close($link_ID);
	header("location:msg/invalidLicense.php");
}
*/

## CHECK HAVE USER ID REQUEST

$strUser = "select count(*) as Total from User;";
$resultUser = mysql_query($strUser,$link_ID);
$objUser = mysql_fetch_object($resultUser);

// If true direct link to main.php
//echo $_SESSION['userReq'];
//if ($objUser->Total == 0 and $RegStatus <> 'N'){
if ($objUser->Total == 0){
	$_SESSION['userReq'] = 'N';
	$_SESSION['userID'] = "ADMIN";
	$_SESSION['userName'] = "ADMIN";
	$_SESSION['buyerNo1'] = '%';
	header("location:main/main.php?content=".$content);
}
//else show login menu
else {
	//header("location:login.php");
	//include("login.php");
//$db_list = mysql_list_dbs($link_ID);
//echo mysql_db_name($db_list, 0);


#### GET IMAGE #####
$strGetFavicon = htmlspecialchars("SELECT * FROM GssbImg WHERE Name LIKE '".$title."favicon' ");
$strGetLogoHQ = htmlspecialchars("SELECT * FROM GssbImg WHERE Name LIKE 'LogoHQRM'");
$strGetLogoWebRM = htmlspecialchars("SELECT * FROM GssbImg WHERE Name LIKE 'LogoWebRM'");
$strGetLogoNT = htmlspecialchars("SELECT * FROM GssbImg WHERE Name LIKE 'NonTrade'");

//echo "SELECT * FROM GssbImg WHERE Name LIKE '".$title."favicon' ";
?>
<html>
<head>
<title><?=strtoupper($objComp->CompName)?></title>

<link href="css/colour.css" rel="stylesheet" type="text/css">
<!--<link rel="shortcut icon" href="/image/logo/<?=strtolower($title)?>/favicon.ico" >-->
<link rel="shortcut icon" href="/script/showImg.php?rval=<?=rand()?>&strGetimg=<?=$strGetFavicon?>" >
<link rel="icon" type="image/gif" href="/image/logo/<?=strtolower($title)?>/animated_favicon1.gif" >


<!-- check browser version , qualification -->
<?include('script/chkQua1.js');?>

<script>
// CHECK BROWSER DISABLED ACTIVE X
// try {
// 	var WshShell = new ActiveXObject('WScript.Shell');
// }catch (failed){
// 	location.href('msg/notQua.php?activex=fail');
// }
//alert(window.name);
</script>

<!-- Auto Windows Full Screen -->
<script language="Javascript" src="script/full.js"></script>

<link href="css/colour.css" rel="stylesheet" type="text/css">

<!-- check login and password txtBox is empty -->
<script language="JavaScript" src="script/chkField.js"></script>

<!-- loading bar  -->
<script language="JavaScript" src="script/loadingBar.js"></script>

<!-- Check IP Adress and Mac Adresss -->
<script type="text/javascript">
        var macAddress = "";
        var ipAddress = "";
        var computerName = "";
        var wmi = GetObject("winmgmts:{impersonationLevel=impersonate}");
        e = new Enumerator(wmi.ExecQuery("SELECT * FROM Win32_NetworkAdapterConfiguration WHERE IPEnabled = True"));
        for (; !e.atEnd() ; e.moveNext()) {
            var s = e.item();
            macAddress = s.MACAddress;
            ipAddress = s.IPAddress(0);
            computerName = s.DNSHostName;
        }
</script>

<!-- check keyboard ALT and F4 key -->
<body onkeydown="if(event.altKey || event.keyCode==115 || event.altKey && event.keyCode==115)alert('Cant Press Alt F4');">

<style>
.tfvNormal{
	font-weight: bold;
	color: green;
}

.mainTitleFont {
	font-family: Tahoma, Verdana, sans-serif;
	font-weight: normal;
	color: #ffffff;
	font-weight: bold; 
	font-size: 18px;
	padding: 2px 0px 2px 5px;
}
</style>


</head>

<body oncontextmenu="window.event.returnValue=false" onload='clearInterval(timer);Loading.style.display="none";login.txtUserID.focus();' OnBlur="MM_showHideLayers('Layer1','','hide');"> 

<!-- Call loading bar -->
<?PHP
include('script/loadingBar.php');

include('script/loading.js');
	
	$hqLayer = "hidden";	 
	$outletLayer = "visible";
	$position = "position:absolute; width=100%;";
	
	if (mysql_select_db("hqRM")) {
		$chk = '<input name="rdMulOut" type="radio" value="H" tabindex=\'1\' checked onClick="MM_showHideLayers(\'LayerHQ\',\'\',\'show\');MM_showHideLayers(\'LayerOutlet\',\'\',\'hide\');"> HQ ';
		$hqLayer = "visible";
		$outletLayer = "hidden";
		
			if (mysql_select_db("webRM")){
				$chk .= '<input name="rdMulOut" type="radio" value="O" tabindex=\'2\' checked onclick="MM_showHideLayers(\'LayerHQ\',\'\',\'hide\');MM_showHideLayers(\'LayerOutlet\',\'\',\'show\');"> Outlet';
				$hqLayer = "hidden";
				$outletLayer = "visible";
			}
	}else {
		$chk = '<input name="rdMulOut" type="radio" value="O" tabindex=\'1\' checked onClick="MM_showHideLayers(\'LayerHQ\',\'\',\'show\');MM_showHideLayers(\'LayerOutlet\',\'\',\'hide\');"> Outlet ';
	}

?>

<div>


<!-- Form  -->
<?PHP if(empty($_GET['Action'])) {?>

	<table  width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td height="40px"></td>
		</tr>
	</table>


	<div id='LayerHQ' align="center" style='<?=$position?> visibility: <?=$hqLayer?>;'>
		<!--<img src="image/logo/logoHQRM.png" border="0" width='256' height='178'>-->
		<img src="/script/showImg.php?rval=<?=rand()?>&strGetimg=<?=$strGetLogoHQ?>" width="256" height="178">
	</div>

<?}?>

<div id='LayerOutlet' align="center" style='visibility: <?=$outletLayer?>;'>
	<!--<img src="image/logo/logoWebRM.png" border="0" width='238' height='178' >-->
	<img src="/script/showImg.php?rval=<?=rand()?>&strGetimg=<?=$strGetLogoWebRM?>" width="256" height="178">
</div>

<form name="login" action="verify.php" method="post" onsubmit="return chkField.exec()">

<!-- Tabel Level 1 -->
<table  height="252" cellSpacing="0" cellPadding="0" width="600" align="center" border="0">
  <tbody>
  <tr vAlign="top" align="right">
    <td background="image/login/User_Login1.gif" colSpan="2" height="142">
      
	  <!-- Table Level 2.1 -->
	  <table cellSpacing="0" cellPadding="0" width="100%" border="0">
        <tbody>
        <tr>
          <td colSpan="2" height="40">&nbsp;</td>
		</tr>
        <tr style='visibility: <?=$disComp?>;'>
		<?//if(empty($Log)){?>
          <td width="60%" class="bodyFont"><div align="center"><?=$chk?></div></td>
          <td width="40%" class="mainTitleFont"><?=$objComp->CompCode?></td>
		 <?//}?>
		</tr>

		<?//if(!empty($Log)){?>
			<tr style='visibility: <?=$disHOLogin?>;'>
				  <td width="100%" class="mainTitleFont" align="center" colspan="2">HQ | Outlet Login</td>
			</tr>
			<tr style='visibility: <?=$disHOLogin?>;'>
			  <td colspan="2" width="100%" class="mainTitleFont" align="center">
			  <select name="selLoc" id="selLoc" style="background-color:#DBEAF5;">
		<?					
						$strSoruce = "SELECT * FROM Location ORDER BY CreateDate , CreateTime";
						$rstSource = mysql_query($strSoruce);
						while ($objSource = mysql_fetch_object($rstSource)) {
						
							echo "<option value='".$objSource->LocationNo."'>".$objSource->LocationNo." - ".$objSource->LocationName."</option>";
						} ### END WHILE
		?>						
			 </select>
			</td>

			<td width="40%" class="mainTitleFont">&nbsp;</td>
			</tr>
		<?//}?>
		</div>

		</tbody>
	  </table> <!-- End Table 2.1 -->
	</td>
  </tr>
  <tr>
    <td vAlign="top" width="513" background="image/login/User_Login2.gif" height="110">
	
	  <!-- Table Level 2.2 -->	
	  <table cellSpacing="0" cellPadding="0" width="508" border="0">
        <tbody>
        <tr>
        	 <?php 

        	 if ($ChkPassAttempt > 0){

        	 	if ($_SESSION['chkLog'] == 'Fail' ){



				if($_SESSION['fail'] == $ChkPassAttempt ){

					


					$invalid = "Your User ID has Been Block Please Contact Admin ";
					// alert to user wait for 10 minutes after
					session_unregister('fail');

   			}      
   				else {

   				$UserID=$_SESSION['txtuserid'];
   				$strUser4= "SELECT  count(*) as matching FROM User where UserID = '$UserID'";
				$resultUser4=  mysql_query($strUser4,$link_ID);
				$countUser4 = mysql_num_rows($resultUser4);
				$userObj4 = mysql_fetch_object($resultUser4);
				$countUser4= $userObj4->matching;	
				//echo $strUser4;

   				//sini comparison kalo ad isi
   				if ($countUser4 > 0){
   				$User=$_SESSION['userID1'];
   				$Ipadress=$_SESSION['txtIPAdress'];
   				$MacAdress=$_SESSION['txtMACAdress'];

  				$calculation = ($ChkPassAttempt - ( $_SESSION['Attempt'] + 1) );
				$UserName=$_SESSION['userName'];
				$invalid ="Invalid Username and Password";
				$remaining = 'Remaining Attempt is ';
				$attempt = $calculation ;
				if (ISSET ($_SESSION['inva'])){

					$invalid = $_SESSION['inva'] ;
					$remaining = $_SESSION['remain'];
					$attempt = $_SESSION['calculation'];
				}

				session_unregister('fail');} 
				else {

				if ($_SESSION['chkLog'] == 'Fail'){ 

        	 	$User=$_SESSION['userID1'];
        	 	$UserName=$_SESSION['userName'];
   				$Ipadress=$_SESSION['txtIPAdress'];
   				$MacAdress=$_SESSION['txtMACAdress'];	

        	 	$strInsert6 = "Insert into LogLoginIP (UserID,LoginDate,LoginTime,IP,MacAdd) values ('$User',curdate(),CurTime(),'$Ipadress','$MacAdress')";
		 		mysql_query($strInsert6,$link_ID);

		 		$strInsert7 = "Insert into LogLoginAttempt  (UserID,UserName,LoginDate,LoginTime,Status) values ('$User','$UserName',curdate(),CurTime(),False)";
		 		mysql_query($strInsert7,$link_ID);
		 		//echo $strInsert6;	 
				$invalid = "Invalid Username and Password";
				session_unregister('chkLog');
			 } 
				}
   				

   				}
				
   				session_unregister('chkLog');
   				session_unregister('inva');


			 } 

			 else {
			 		if($_SESSION['fail'] ==  $ChkPassAttempt ){


					$invalid = "Your User ID has Been Block Please Contact Admin ";
					$disable = "disabled";
					session_unregister('fail');


   			}      

			       }

        	 }

        	 else {


        	 	if ($_SESSION['chkLog'] == 'Fail'){ 

        	 	$User=$_SESSION['userID1'];
        	 	$UserName=$_SESSION['userName'];
   				$Ipadress=$_SESSION['txtIPAdress'];
   				$MacAdress=$_SESSION['txtMACAdress'];	

        	 	$strInsert6 = "Insert into LogLoginIP (UserID,LoginDate,LoginTime,IP,MacAdd) values ('$User',curdate(),CurTime(),'$Ipadress','$MacAdress')";
		 		mysql_query($strInsert6,$link_ID);




		 		$strInsert7 = "Insert into LogLoginAttempt  (UserID,UserName,LoginDate,LoginTime,Status) values ('$User','$UserName',curdate(),CurTime(),2)";
		 		mysql_query($strInsert7,$link_ID);
		 		//echo $strInsert6;	 
				$invalid = "Invalid Username and Password";
				session_unregister('chkLog');


				
			 } 

        	 }

        	 ?>

        	
          <td colSpan="6" height="37"><center><i><b><font color="#FF0000"><?echo $invalid;?><br><?echo $remaining;?><?echo $attempt;?></font></b></i></center></td></tr>
        <tr>
		  <td width="75" rowSpan="2"></td>
          <td width="126" id="t_ID" class="tfvNormal">User ID : </td>
          <!-- Input For Mac Adress and IP Address -->
           <input type="hidden" id="txtMACAdress" name="txtMACAdress" />
           <input type="hidden" id="txtIPAdress"  name ="txtIPAdress" />
           <input type="hidden" id="txtComputerName"/>
           <script type="text/javascript">
            document.getElementById("txtMACAdress").value = unescape(macAddress);
            document.getElementById("txtIPAdress").value = unescape(ipAddress);
            document.getElementById("txtComputerName").value = unescape(computerName);
       	    </script>

          <td width="39" rowSpan="2">&nbsp;</td>
          <td width="131" id="t_Pass" class="tfvNormal">Password :</td>
          <td width="102" rowSpan="2">
          <p align="center"><input type="image" src="image/login/buttIn.gif" name="Submit" onClick="MM_showHideLayers('Layer1','','show')"></td>
          <td width="35"></td></tr>

        <tr>
          <td><input 
            style="BORDER-RIGHT: #ffffff 0px solid; BORDER-TOP: #ffffff 0px solid; font-SIZE: 9pt; BORDER-LEFT: #ffffff 0px solid; WIDTH: 110px; BORDER-BOTTOM: #c0c0c0 1px solid; HEIGHT: 16px; BACKGROUND-COLOR: #ffffff; COLOR:#3300FF"
            maxLength="20" name="txtUserID" tabindex='3'></td>
          <td><input  
            style="BORDER-RIGHT: #ffffff 0px solid; BORDER-TOP: #ffffff 0px solid; font-SIZE: 9pt; BORDER-LEFT: #ffffff 0px solid; WIDTH: 110px; BORDER-BOTTOM: #c0c0c0 1px solid; HEIGHT: 16px; BACKGROUND-COLOR: #ffffff; COLOR:#3300FF" 
            type="password" maxLength="20" name="txtPass" tabindex='4'></td>
          <td>
			<?$ObjSysParam = GET_SYSPARAM_SETTING("%");?>
			<input type="hidden" name="CompCode" id="CompCode" value="<?=$_SESSION['CompCode']?>">
			<input type="hidden" name="ChkConSotre" id="ChkConStore" value="<?=$ObjSysParam->ChkConStore?>">
		  </td>
		</tr>
		</tbody>
	  </table> <!-- End Table Level 2.2 -->
	</td>
    <td width="87"> <IMG SRC="image/login/User_Login3.gif"  BORDER="0"></td></tr>
  </tbody>
</table> <!-- End Table Level 1 -->
</form> <!-- End Form -->
</div>
<br>
<?if(!empty($_GET['CompCode'])){?>
	<div id='LayerHQ' align="center" style='<?=$position?> visibility: <?=$hqLayer?>;'>
		<!--<img src="image/logo/logoHQRM.png" border="0" width='256' height='178'>-->
		<img src="/script/showImg.php?rval=<?=rand()?>&strGetimg=<?=$strGetLogoNT?>" width="400" height="130">
	</div>
<?}?>


<script>
//<? $_SERVER['txtMACAdress'];?>
// form fields description structure
var a_fields = {
/*	'uname' : {
		'l': 'Name',  // label
		'r': false,    // required
		'f': 'alpha',  // format (see below)
		't': 't_uname',// id of the element to highlight if input not validated
		
		'm': null,     // must match specified form field
		'mn': 2,       // minimum length
		'mx': null       // maximum length
	},
	*/
	
	'txtUserID' : {'l':'User ID','r':true,'t':'t_ID'},
	'txtPass' : {'l':'Password','r':true,'t':'t_Pass'}
	
},
o_config = {
	'to_disable' : ['Submit'],
	'alert' : 1
}

// validator constructor call
var chkField = new validator('login', a_fields, o_config);

window.onbeforeunload = function(e) {
  return clearSession();
};

function clearSession() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET','./script/destroy-session.php', true);
    xmlhttp.onreadystatechange=function(){
       if (xmlhttp.readyState == 4){
          if(xmlhttp.status == 200){
             alert(xmlhttp.responseText);
         }
       }
    };
    xmlhttp.send(null);
}
</script>
<?//session_destroy();?>
</body>
</html>

<?
//session_destroy();
}
mysql_close($link_ID);

?>