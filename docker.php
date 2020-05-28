$task = $_POST['task'];
 $files = @$_POST['files'];
 //$timecut = @$_POST['timecut'];
 //$cmd = @$_POST['cmd'];
 //$image = $_POST['image'];
 $outputs = @$_POST['outputs'];


 // override image and cmd arguments for security reasons
 switch ($task) {
   case "arhmm": // aka GPAM
     $image = "rost/arhmm";
     $cmd = '';
     break;
   case "em":    // aka PAM
     $image = "eminference";
     $emk = 0 + $_POST['emk'];
     $restarts = 0 + $_POST['restarts'];
     $iterations = 0 + $_POST['iterations'];
     $cmd = "/code/run.sh /data/data.json $emk $restarts $iterations";
     break;
   case "prism":
     $image = "mseve/prism";
     $cmd = "/data/run.sh";
     break;
   default:
     echo "Oops! Invalid docker request!";
     return;
 }