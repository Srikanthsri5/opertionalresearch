var mas,table;
var mascopy,price;
var err;
var text;


function ClearCarrier(){
  $("#carrier_number").val("");
}

function ClearConsumer(){
  $("#consumer_number").val("");
}

function ClearICarr(){
  $("#i-rest").val("");
}

function ClearJCons(){
  $("#j-rest").val("");
}

function ClearDIJ(){
  $("#dij-rest").val("");
}

function ClearBorders(){
  $("#ij-rest").val("");
}

function CreateTable(){
  $("#calculate_block").empty();
  $("#input_table").empty();

  var carrier = $("#carrier_number").val();
  var consumer = $("#consumer_number").val();

  //input errors fix

  var errors = 0;
 
  if (carrier == ""){
    $("#carrier_number").val("Enter the number of suppliers!");
    errors ++;
  } 
  else if (parseInt(carrier) != carrier){
    $("#carrier_number").val("Invalid data format!");
    errors ++;
  } 
  else if (carrier <= 0){
    $("#carrier_number").val("Number of suppliers> 0!");
    errors ++;
  }

  if (consumer == ""){
    $("#consumer_number").val("Enter the number of consumers!");
    errors ++;
  } 
  else if (parseInt(consumer) != consumer){
    $("#consumer_number").val("Invalid data format!");
    errors ++;
  } 
  else if (consumer <= 0){
    $("#consumer_number").val("Number of consumers> 0!");
    errors ++;
  }

  if (errors != 0){
    return;
  }

  //creating table

  var table = "<table class=\"north_west_table\" id=\"main_table\" border=\"10\" cellspacing=\"10\">";
  for (var i = 0; i <= carrier; i++){
    table += "<tr class=\"rows_number\">";
    for (var j = 0; j <= consumer; j++){
      if (i == 0 && j != 0){
        table += "<td style=\"background-color: #ff928b;\">B[" + j + "]=<input type=\"text\" id=\"" + i + "_" + j + "\" class=\"table_input_date\" style=\"text-align:center; background-color: #ffcfcc; border-radius:10px; outline:none; font-size: 14pt; padding: 15px; border: 0px;\" size=\"5\"></td>"; 
      }
      else if(i != 0 && j == 0){
        table += "<td style=\"background-color: lightgreen;\">A[" + i + "]=<input type=\"text\" id=\"" + i + "_" + j + "\" class=\"table_input_date\" style=\"text-align:center; background-color: #d3f8d3; border-radius:10px; outline:none; font-size: 14pt; padding: 15px; border: 0px;\" size=\"5\"></td>"; 
      }
      else {
          if (i == 0 && j == 0){
              table += "<td style=\"background-color: thistle;\"></td>"; 
          } else {
              table += "<td style=\"background-color: thistle;\"><input type=\"text\" id=\"" + i + "_" + j + "\" class=\"table_input_date\" style=\"text-align:center; background-color: #ecdfec; border-radius:10px; outline:none; font-size: 14pt; padding: 15px; border: 0px;\" size=\"7\"></td>"; 
          }        
      }
    }
    table += "</tr>";
  }
  table += "</table>"

  $("#input_table").show(); 
  $("#input_table").append(table); 
  /*$("#input_table").append("<br><select id=\"restrictions\"><option value=\"0\">Без дополнительных ограничений</option><option value=\"1\">Запрет перевозок от i-го поставшика к j-му потребителю</option><option value=\"2\">Фиксированная поставка от i-го поставшика к j-му потребителю</option><option value=\"3\">Нижняя граница на поставки</option><option value=\"4\">Верхняя граница на поставки</option></select><div id=\"restrict-block\"></div>");
  $("#input_table").append("<input type=\"text\" id=\"table_error_log\" style=\"display: none; margin: 10px;\" size=\"25\"><br><input type=\"button\" id=\"table_create_button\" onClick=\"GiveMasElements();return false;\" value=\"Принять\">");*/
  $("#select_apply_block").show();
}

function GiveMasElements(){
  $("#calculate_block").empty();
  
  var restrict = $("#restrictions").find(":selected").val(); 
  var rows = $(".rows_number").length;
  var cols = $(".table_input_date").length / rows;

  $("#table_error_log").empty();
  $("#table_error_log").hide();
  $("#input_restrictions").show();
  $("#input_restrictions").empty();
  
  var mas = [];
  var err = 0;
  
  for(var i = 0; i < rows; i++){
    mas.push([]);
    for (var j = 0; j < cols; j++){
      var elem = $("#" + i + "_" + j).val();
      var errors = 0;
      
      //input errors fix
      
      if (i == 0 && j == 0){
        mas[i][j] = "";
        continue;
      }
      else if ((i == 0 || j == 0) && parseInt(elem) != elem){
        $("#table_error_log").show();
        $("#table_error_log").text("Invalid data format!");
        errors++;
      }
      else if(elem == ""){
        $("#table_error_log").show();
        $("#table_error_log").text("Fill the table!");
        errors++;
      } 
      else if (parseFloat(elem) != elem){
        $("#table_error_log").show();
        $("#table_error_log").text("Invalid data format!");
        errors++;
      } 
      else if (elem < 0){
        $("#table_error_log").show();
        $("#table_error_log").text("Freight price> 0!");
        errors++;
      }
      
      //save table values
      
      if (errors == 0){
        mas[i][j] = elem;
      }
      else{
        err++;
        $("#" + i + "_" + j).val("!!!!!");
      }
    }
  }
  this.mas = mas;
  this.err = err;
  
  // add rest. inputs
  
  if (err == 0){
    if (restrict == 1){
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"i-rest\" onClick=\"ClearICarr();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter supplier\">");
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"j-rest\" onClick=\"ClearJCons();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter consumer\">");
    }
    if (restrict == 2){
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"i-rest\" onClick=\"ClearICarr();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter supplier\">");
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"j-rest\" onClick=\"ClearJCons();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter consumer\">");
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"dij-rest\" onClick=\"ClearDIJ();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter delivery size\">");
    }
    if (restrict == 3 || restrict == 4){
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"i-rest\" onClick=\"ClearICarr();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter supplier\">");
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"j-rest\" onClick=\"ClearJCons();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter consumer\">");
      $("#input_restrictions").append("<input class=\"init_numbers\" type=\"text\" id=\"dij-rest\" onClick=\"ClearDIJ();return false;\" style=\"margin: 10px;\" size=\"25\" value=\"Enter the border\">");
    }

    $("#input_restrictions").append("<br><input class=\"btn btn-default\" type=\"button\" id=\"table_create_button\" onClick=\"Restrictions();return false;\" style=\"margin-bottom: 30px;\" value=\"Calculate\">");
  }
}

function Restrictions(){
  $("#calculate_block").empty();
  
  var mas = this.mas;
  var err = this.err;
  var rows = $(".rows_number").length;
  var cols = $(".table_input_date").length / rows;
  var restrict = $("#restrictions").find(":selected").val(); 

  var sum1 = 0;
  var sum2 = 0;
  var errors = 0;
  var text = "";
  var numberofrest = 0;
  var datefornextcalculate = 0;
  
  //inputs & input errors fix
  
  if (restrict == 1){
    var carrdate = $("#i-rest").val();
    var consdate = $("#j-rest").val();
    
    if (parseFloat(carrdate) != carrdate || carrdate <= 0 || carrdate >= rows){
      $("#i-rest").val("Invalid data format!");
      errors++;
    } 
  
    if (parseInt(consdate) != consdate || consdate <= 0 || consdate >= cols){
      $("#j-rest").val("Invalid data format!");
      errors++;
    }
  }
  
  if (restrict == 2 || restrict == 3 || restrict == 4){
    var carrdate = $("#i-rest").val();
    var consdate = $("#j-rest").val();
    var dijdate = $("#dij-rest").val();
    
    if (parseFloat(carrdate) != carrdate || carrdate <= 0 || carrdate >= rows){
      $("#i-rest").val("Invalid data format!");
      errors++;
    }
    if (parseInt(consdate) != consdate || consdate <= 0 || consdate >= cols){
      $("#j-rest").val("Invalid data format!");
      errors++;
    }
    if (parseInt(dijdate) != dijdate || dijdate <= 0){
      $("#dij-rest").val("Invalid data format!");
      errors++;
    }
  }
  
  if (errors != 0){
    return;
  }
  
  // restrictions

  if (restrict == 1){
    text = "We introduce a ban on deliveries from " + carrdate + "supplier to " + consdate + "to the consumer. To do this, we introduce the cost of transportation of a unit of cargo C [" + carrdate + "][" + consdate + "] much more than the cost of other transportation. ";
    mas[carrdate][consdate] *= 1000;
    numberofrest = 1;
  }

  if (restrict == 2){
    text = "Because along the route (" + carrdate + ", " + consdate + ")must be transported exactly" + dijdate + " load, then we will decrease by value " + dijdate + " stock " + carrdate + "-th supplier and demand " + consdate + "th consumer and introduce a ban on the supply of goods from " + carrdate + "supplier to " + consdate + "to the consumer. ";
    mas[carrdate][0] -= dijdate;
    mas[0][consdate] -= dijdate;
    numberofrest = 2;
    datefornextcalculate = dijdate * mas[carrdate][consdate];
    mas[carrdate][consdate] *= 1000; 
  }

  if (restrict == 3){
    text = "Because along the route (" + carrdate + ", " + consdate + ") must be transported at least" + dijdate + " load, then we will decrease by value " + dijdate + " stock " + carrdate + "-th supplier and demand " + consdate + "consumer. ";
    mas[carrdate][0] -= dijdate;
    mas[0][consdate] -= dijdate;
    numberofrest = 3;
  }

  //add fict consumers and carriers
  
  for (var i = 1; i < mas.length; i++){
    sum1 += parseInt(mas[i][0]);
  }
  
  for (var j = 1; j < mas[0].length; j++){
    sum2 += parseInt(mas[0][j]);
  }

  if (sum1 > sum2){   
    mas[0][cols] = (sum1 - sum2).toString();
    for (var i = 1; i < rows; i++){
      mas[i][cols] = "0";
    }
    cols++;
    text += "Because the sum of consumer requests is less than the sum of the suppliers' stocks, we introduce a fictitious consumer to bring the problem to a closed type.";
  }
    
  if (sum2 > sum1){
    mas.push([]);
    mas[rows][0] = (sum2 - sum1).toString();
    for (var j = 1; j < cols; j++){
      mas[rows][j] = "0";
    }
    rows++;
    text += "Because the sum of consumer requests is greater than the sum of suppliers' stocks, we introduce a fictitious supplier to bring the problem to a closed type."; 
  }
    
  // copy mas

  if (err == 0){
    var mascopy = [];
    for (var i = 0; i < mas.length; i++){
      mascopy.push([]);
      for (var j = 0; j < mas[0].length; j++){
        mascopy[i][j] = mas[i][j];
      }
    } 
    
    for (var i = 1; i < mas.length; i++){
      for (var j = 1; j < mas[1].length; j++){
        mas[i][j] = "";
      }
    }

    if (restrict == 4){
      numberofrest = 4;

      NorthWestWithRest(mas, mascopy, dijdate, carrdate, consdate);

      mas = this.mas;
      mascopy = this.mascopy;
      text += this.text;
    }

    PrintTable(mas, mascopy, text + " The resulting original table:");
    NorthWest(mas, mascopy);
  }
}

function PrintTable(mas, mascopy, comment){
  var tableViev = "<div align=\"justify\"><h3>" + comment + "</h3>";

  tableViev += "<table class=\"north_west_table\" border=\"10\" cellspacing=\"10\">";
  for (var i = 0 ; i < mas.length; i++){
    tableViev += "<tr>";
    for (var j = 0; j < mas[i].length; j++) {
      if (i == 0 && j != 0){
       tableViev += "<td style=\"background-color: #ff928b;\">" + "B[" + j + "]=" + mas[i][j] + "</td>";
      }
      else if (i != 0 && j == 0){
       tableViev += "<td style=\"background-color: lightgreen;\">" + "A[" + i + "]=" + mas[i][j] + "</td>";
      } 
      else{
       tableViev += "<td style=\"background-color: thistle;\"><div align=\"justify\"><b>" + mas[i][j] + "</b></div><div align=\"center\">" + mascopy[i][j] + "</div></td>";
      }
    }
    tableViev += "</tr>";
  }
  tableViev += "</table></div>";

  $("#calculate_block").show(); 
  $("#calculate_block").append(tableViev); 
}

/*function PrintTable(mas, mascopy, comment){
  var tableViev = "<div align=\"center\"><h3>" + comment + "</h3>";

  tableViev += "<table class=\"north_west_table\" border=\"10\" cellspacing=\"10\">";
  for (var i = 0 ; i < mas.length; i++){
    tableViev += "<tr>";
    for (var j = 0; j < mas[i].length; j++) {
      if (i == 0 && j != 0){
       tableViev += "<td style=\"background-color: #ff928b;\"><br><div align=\"center\" style=\"width: 10vh;\">" + "B[" + j + "]=" + mas[i][j] + "</div><br></td>";
      }
      else if (i != 0 && j == 0){
       tableViev += "<td style=\"background-color: lightgreen;\"><br><div align=\"center\" style=\"width: 10vh;\">" + "A[" + i + "]=" + mas[i][j] + "</div><br></td>";
      } 
      else{
       tableViev += "<td style=\"background-color: thistle;\"><div align=\"left\" style=\"width: 10vh;\"><b>" + mas[i][j] + "</b></div><br><div align=\"right\" style=\"width: 10vh;\">" + mascopy[i][j] + "</div></td>";
      }
    }
    tableViev += "</tr>";
  }
  tableViev += "</table></div>";

  $("#calculate_block").show(); 
  $("#calculate_block").append(tableViev); 
}*/

function NorthWest(mas, mascopy, dijdate, carrdate, consdate){
  for (var i = 1; i < mas.length; i++){
    for (var j = 1; j < mas[0].length; j++){
      mas[i][j] = "";
    }
  }
  var i = 1, j = 1;
  var step = 1;
  var text = "";
  while (i < mas.length && j < mas[i].length){
    if ((i + 1) < mas.length && (j + 1) <mas[i].length){
      if (mas[i][0] < mas[0][j]){
        text = "Т.к. запросы " + j + "-го потребителя больше запасов " + i + "-го поставщика, записываем в клетку(" + i + ", " + j + ") сумму запаса " + i + "-го поставщика и переходим к " + (i + 1) + "-му поставщику.";
        mas[i][j] = mas[i][0];
        mas[0][j] -= mas[i][0];
        mas[i][0] = 0;
        i++;
       }
       else{
        if (mas [i] [0] == mas [0] [j]) {
           text = "Since the stocks of the" + i + "-th supplier are equal to the requests of the" + j + "-th consumer, write in the box (" + i + "," + j + ") the sum of the request" + j + " -th consumer and go to "+ (j + 1) +" -th consumer, assuming that the stocks of "+ i +" of the -th supplier still remain (although they are equal to 0). ";
         }
         else {
           text = "Since the stocks of the" + i + "-th supplier are greater than the requests of the" + j + "-th consumer, we write in the box (" + i + "," + j + ") the sum of the request" + j + " -th consumer and go to "+ (j + 1) +" -th consumer. ";
         }
         mas[i][j] = mas[0][j];
         mas[i][0] -= mas[0][j];
         mas[0][j] = 0;
         j++;
       }
    } else {
      if (mas[i][0] < mas[0][j]){
      text = "Since the requests" + j + "of the th consumer are more than the stocks of the" + i + "th supplier, we write in the box (" + i + "," + j + ") the amount of the stock" + i + " th supplier. ";
        mas [i] [j] = mas [i] [0];
        mas[0][j] -= mas[i][0];
        mas[i][0] = 0;
        i++;
       }
       else{
         if (mas[i][0] == mas[0][j]){
        text = "Since the stocks of the" + i + "-th supplier are equal to the requests of the" + j + "-th consumer, we write in the box (" + i + "," + j + ") the sum of the request" + j + " -th consumer, assuming that the stocks of "+ i +" of the -th supplier still remain (although they are equal to 0). ";
         }
         else {
           text = "Since the stocks of the" + i + "-th supplier are greater than the requests of the" + j + "-th consumer, we write in the box (" + i + "," + j + ") the sum of the request" + j + " th consumer. ";
         }
         mas[i][j] = mas[0][j];
         mas[i][0] -= mas[0][j];
         mas[0][j] = 0;
         j++;
       }
    }    

    PrintTable(mas, mascopy, "Step " + step + " " + text);
     step++;
  }
  this.mas = mas;
  this.mascopy = mascopy;
    start();
    
}

function NorthWestWithRest(mas, mascopy, dijdate, carrdate, consdate){
  for (var i = 1; i < mas.length; i++){
    for (var j = 1; j < mas[0].length; j++){
      mas[i][j] = "";
    }
  }
  var i = 1, j = 1;
  var text = "";
  while (i < mas.length && j < mas[i].length){
    if (mas[i][0] < mas[0][j]){
      mas[i][j] = mas[i][0];
      mas[0][j] -= mas[i][0];
      mas[i][0] = 0;
      i++;
    }
    else{
      mas[i][j] = mas[0][j];
      mas[i][0] -= mas[0][j];
      mas[0][j] = 0;
      j++;
    }
  }
 
  if (mas[carrdate][consdate] != "" && mas[carrdate][consdate] >= dijdate){
    for (i = 0; i < mas.length; i++){
      mas[i].splice(carrdate, 0, mas[i][carrdate]);
      mascopy[i].splice(carrdate, 0, mascopy[i][carrdate]);
      mas[i][0] = mascopy[i][0];
    }

    text = "T.k. x[" + carrdate + "][" + consdate + "] <= d, " + consdate + "-th column of the transportation matrix is ​​split into 2 columns j 'and j' '. Demand" + consdate + "-th consumer is divided into 2 parts: b [j '] = d and b [j' '] = b [j] - d. Tariffs in both columns are the same, except for tariff C[" + carrdate + ", " + (parseFloat(consdate) + 1) + "],which is much higher than all others, which means a ban on transportation from " + carrdate + "supplier to " + consdate + "to the consumer. ";
    mascopy[carrdate][(parseFloat(consdate) + 1)] *= 1000;
    var mastmp = mascopy[0][consdate];
    mas[0][consdate] = dijdate;
    consdate ++;
    mas[0][consdate] = mastmp - dijdate;
  }

  this.mas = mas;
  this.mascopy = mascopy;
  this.text = text;
}

//_______________________________________________




function start()
{
  function output(mas)
 {
 for(var i=0;i<mas.length;i++)
 {
     for(var j=0;j<mas[i].length;j++)
     {
       /*  document.write("  "+mas[i][j]+"  ");*/ $("#calculate_block").append("  "+mas[i][j]+"  ");
     }
   /*  document.write('<br>');*/ $("#calculate_block").append("<br>");
 }
}
//уравнения
function equ () 
{
    eq = new Array(count);
    for (var i = 0; i < eq.length; i++)
	{
        eq[i] = new Array(3);
    }
    var s=0;
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < table[i].length; j++) {
            if (table[i][j] != null) {
                eq[s][0] = j;
                eq[s][1] = i;
                eq[s][2] = price[i][j];
                s++;
            }
        }
    }
   /* document.write("<br>");$("#start").append("<br>");*/
    for(var i=0;i<eq.length;i++)
    {
        //document.write("V<sub>"+(eq[i][0]+1)+"</sub>"+"+"+"U<sub>"+(eq[i][1]+1)+"</sub>"+"="+eq[i][2]+"<br>");
        $("#calculate_block").append("V<sub>"+(eq[i][0]+1)+"</sub>"+"+"+"U<sub>"+(eq[i][1]+1)+"</sub>"+"="+eq[i][2]+"<br>");
    }
    U = new Array(table.length);
    V = new Array(table[0].length);

    for (var i = 0; i < U.length; i++) {
        U[i] = "*";
    }

    for (var i = 0; i < V.length; i++) {
        V[i] = "*";
    }
}
// вычисление потенциалов
function find()
{
    equ();
    U[0] = 0;
    V[eq[0][0]] = eq[0][2];
    var number = 0;
    var del = new Array(1);
    del[0] = 0;
    var check = false,a=1,check1=true;
    var c=0,i=0;
    do
    {

        if (V[eq[i][0]] != "*" && U[eq[i][1]] == "*") {
            U[eq[i][1]] = eq[i][2] - V[eq[i][0]];
        }
        else if (U[eq[i][1]] != "*" && V[eq[i][0]] == "*")
        {
            V[eq[i][0]] = eq[i][2] - U[eq[i][1]];
        }
        if (i == eq.length - 1) {
            for (var l = 0; l < U.length; l++) {
                if (U[l] == "*") {
                    bU = false;

                }
                else bU = true;
            }
            for (var l = 0; l < V.length; l++) {
                if (V[l] == "*") {
                    bV = false;
                    break;
                }
                else bV = true;
            }

            if (bU == false || bV == false)
            {
                i = 0;
            }
            else check = true;
        }
        i++;
        c++;
        if(c>eq.length*4)
        {
            check=true;
            check1=false;
           /* document.write("Невозможно найти потенциалы");*/$("#calculate_block").append("<p>Potentials are hard to find</p>");
        }
    }
    while (check == false)
    return check1;
}
function delta()
{
	delC=[];
    delC = new Array(table.length);
    for (var i = 0; i < delC.length; i++)
    {
        delC[i] = new Array(table[i].length);
        for (var j = 0; j < delC[i].length; j++)
        {
            delC[i][j] = price[i][j] - U[i] - V[j];
        }
    }
}
//Проверка
function optimal()
{
    var k=1,max;
    var n=['.','.',false];
    for(var i=0;i<delC.length;i++)
     {
        for (var j = 0; j < delC[i].length; j++)
        {
            if (delC[i][j] < 0 && table[i][j]==null)
            {
                if(k==1)
                {
                    max=Math.abs(delC[i][j]);
                    n=[i,j,true];
                }
                else if(Math.abs(delC[i][j])>max)
                    n = [i, j, true];
                k=0;
            }
        }

    }
    return n;
}
function permutation(n)
{
	var finish=false,cycle,finish=false,k=[n[0],n[1]],c=false,r=false,num=2,z,q=0,x=1,way,up,down,left,right,
	cycle=[[n[0],n[1],'+']],
	way=["start:"],del =[[n[0],n[1]]],last=[n[0],[1]];
	while (finish==false)
    {

       if(c==false)
        {
            for (var i = k[0] + 1; i < table.length && i>=0; i++)
            {
                    if (table[i][k[1]] != null && i != k[0] /* && i!=del[g][0] && k[1]!=del[g][1] && i!=cycle[cycle.length-1][0]*/)
                    {
                        /*for(var g=0;g<del.length;g++)
                        {
                            if (i != del[g][0] && k[1]!= del[g][1] && x!=1)
                            {*/
                                c = true;
                                k[0] = i;
                                if (num % 2 == 0) {
                                    z = '-';
                                }
                                else z = '+';
                                num++;
                                cycle.push([k[0], k[1], z]);
                                way.push("Down");
                                break;
                          //  }
                      //  }
                    }
                }
            }


         if (c == false)
        {
            for (var i = k[0]; i < table.length && i >= 0; i--) {
                if (table[i][k[1]] != null && i!=k[0] /*&& i!=cycle[cycle.length-1][0]*/)
                {
                    c = true;
                    k[0] = i;
                    if (num % 2 == 0)
                    {
                        z = '-';
                    }
                    else z = '+';
                    num++;
                    cycle.push([k[0], k[1], z]);
                    way.push("UP");
                    break;
                }
            }
        }

        if (cycle[cycle.length-1][0]==cycle[0][0])
        {
            up=false;
            down=false;
            left=false;
            right=false;
            for(var i=0;i<way.length;i++)
            {
                if(way[i]=="Down")
                    down=true;
                else if(way[i]=="UP")
                    up=true;
                else if(way[i]=="Left")
                    left=true;
                else if(way[i]=="Right")
                    right=true;

            }
            if((down==true &&left==true)||(down==true &&right==true)||(up==true &&left==true)||(up==true &&right==true) )
            {
                r = true;
                finish = true;
            }
        }
          if (r == false) {
              for (var j = k[1] - 1; j < table[0].length && j >= 0; j--) {
                  if (table[k[0]][j] != null && j != k[1]/* && j!=cycle[cycle.length-1][1]*/)
                  {
                      r = true;
                      k[1] = j;
                      if (num % 2 == 0) {
                          z = '-';
                      }
                      else z = '+';
                      num++;
                      cycle.push([k[0], k[1], z]);
                      way.push("Left");
                      break;
                  }
              }
          }

          if (r == false) {
              for (var j = k[1] + 1; j < table[0].length && j >= 0; j++) {
                  if (table[k[0]][j] != null && j != k[1] /*&& j!=cycle[cycle.length-1][1]*/)
                  {
                      r = true;
                      k[1] = j;
                      if (num % 2 == 0) {
                          z = '-';
                      }
                      else z = '+';
                      num++;
                      cycle.push([k[0], k[1], z]);
                      way.push("Right");
                      break;
                  }
              }
          }

        if (cycle[cycle.length-1][1]==cycle[0][1] && cycle[cycle.length-1][0]==cycle[0][0] )
        {
            up=false;
            down=false;
            left=false;
            right=false;
            for(var i=0;i<way.length;i++)
            {
                if(way[i]=="Down")
                    down=true;
                else if(way[i]=="UP")
                    up=true;
                else if(way[i]=="Left")
                    left=true;
                else if(way[i]=="Right")
                    right=true;

            }
            if((down==true &&left==true)||(down==true && right==true)||(up==true &&left==true)||(up==true &&right==true) )
            {
                finish = true;
            }
        }
        if(cycle[cycle.length-1][0]==last[0] && cycle[cycle.length-1][1]==last[1] )
        {
            del.push([cycle[cycle.length - 1][0], cycle[cycle.length - 1][1]]);
            cycle=[[n[0],n[1],"+"]];
        }

        x=0;
        c=false;
        r=false;
        last[0]=cycle[cycle.length-1][0];
        last[1]=cycle[cycle.length-1][1];
     }


     var min=table[cycle[1][0]][cycle[1][1]];
     for(var i=1;i<cycle.length;i+=2)
     {
         if(min>table[cycle[i][0]][cycle[i][1]])
         {
             min=table[cycle[i][0]][cycle[i][1]]
         }
     }
	 
	 
	
	 $("#calculate_block").append("<p align=\"justify\">min:"+min+"<br>Let us mark the cell with the negative difference ΔCij with the “+” sign, the next with the “-” sign, and so on, in turn. <br> Cycle </p>");
	 $("#calculate_block").append("<p align=\"justify\">Row number (1) <br> Column number (2) <br> Sign (3)<br>");
      for(var i=0;i<cycle.length;i++)
	 {
       $("#calculate_block").append("(1): "+cycle[i][0]+"   (2): "+cycle[i][1]+"   (3): "+cycle[i][2]+"<br>");
	 }
	$("#calculate_block").append("</p><p align=\"justify\">Minimum value in a loop: "+min+"</p>");
    $("#calculate_block").append("<p align=\"justify\">Cycle:"+cycle+"</p>");
	
	
    $("#calculate_block").append("<p align=\"justify\">Then we find the minimum value of the load in the cells of the cycle with the “-” sign and enter it into a free cell with the “+” sign. Then we sequentially go through all the cells of the cycle, alternately subtracting and adding to them the minimum value (in accordance with the signs with which these cells are marked: where minus is subtract, where plus is we add). Let's get a new basic transportation plan: </p>");
     table[cycle[0][0]][cycle[0][1]]=min;
     for(var i=1;i<cycle.length;i++)
     {
         if(cycle[i][2]=="+")
         {
            table[cycle[i][0]][cycle[i][1]]+=min;
         }
         else if(cycle[i][2]=="-")
         {
             table[cycle[i][0]][cycle[i][1]]-=min;
         }

     }
    if((table.length+table[0].length-1)<count)
    {
        $("#calculate_block").append("<p align=\"justify\">Since there are more basic cells than m + n - 1, we make the basic cell with zero value free</p>");
        for(var i=0;i<table.length;i++)
        {
            for(var j=0;j<table[i].length;j++)
            {
                if(table[i][j]==0)
                {
                    table[i][j] = null;
                   
                    break;
                }

            }
        }
    }
    /*("#start").append("<p>"+way+"</p><br>");*/
     outT(false);
}
function outT(b)
{
    var a,tab = "";
	//document.write('<div align="center">');
//document.write('<table border="5" cellpadding="5" cellspacing="10">');
    tab+='<div align="center">';
    tab+='<table class=\"north_west_table\" border="5" cellpadding="5" cellspacing="10">';
for (var i = 0; i < table.length; i++)
{
   /* document.write("<tr>");*/ tab+="<tr>";
    for(var j = 0; j < table[1].length; j++)
    {
        if(b==true)
        {
            a=delC[i][j]+"|";
        }
        else a=" ";
        if(table[i][j]!=null)
        {
           // document.write("<td>" + table[i][j] + "<br>" + a + price[i][j] + "</td>");
            tab+="<td>" + table[i][j] + "<br>" + a + price[i][j] + "</td>";
        }
        else /*document.write("<td>&#8212<br>"+a+price[i][j] + "</td>"); */ tab+="<td>&#8212<br>"+a+price[i][j] + "</td>";
        if(table[i][j]!=null)
            count++;
    }
   // document.write("</tr>");
    tab+="</tr>";
}
//document.write("</table></div>");
tab+="</table></div>";
    $("#calculate_block").append(tab);
}
function vir()
{
    count=0;
    var calc=0,n;
    for(var i=0;i<table.length;i++)
    {
        for(var j=0;j<table[i].length;j++)
        {
            if(table[i][j]!=null)
                count++;
        }
    }
    calc=table.length+table[0].length-1-count;
    if(table.length+table[0].length-1>count)
    {
        while(calc!=0)
        {
            for (var i = 0; i < table.length-1; i++)
            {
                if (table[i+1][i]==null && calc!=0 )
                {
                    table[i+1][i]=0;
                    calc--;
                    break;
                }
            }
        }
    }
}
//ввод данных
var table,price;
$("#calculate_block").append("<h1 style=\"margin-bottom: 40px;\">Potential method</h1>");
  
  table=new Array(mas.length-1);
  price=new Array(table);
  for(var i=1;i<mas.length;i++)
  {
    table[i-1]=new Array(mas[i].length-1);
      price[i-1]=new Array(table[i]);
    for(var j=1;j<mas[i].length;j++)
    {
      if(mas[i][j]!="")
      table[i-1][j-1]=mas[i][j];
      else if(mas[i][j]==null)
          table[i-1][j-1]=0;
      else table[i-1][j-1]=null;
      price[i-1][j-1]=mascopy[i][j];
    }
  } 
vir();
outT(false);
var count, complete=false;
var V, U, bV = false, bU = false, eq, delC, n,o=0,C;
while(complete==false)
{
    count = 0;
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < table[i].length; j++) {
            if (table[i][j] != null)
                count++;
        }
    }
    $("#calculate_block").append("<p><h2>Calculating Potentials for a Transportation Plan</h2></p>");
    $("#calculate_block").append("<p align=\"justify\">Let us compare each supplier Ai and each consumer Bj with the values ​​of Ui and Vj, respectively, so that for all basic cells of the plan the following relation is fulfilled: Ui + Vj = Cij</p>");
    /* document.write('<div align="center">Уравнения:');*/
    C = find();
    if (C != false) {
        /* document.write("Потенциалы:<br>");
         document.write("V:" + V + "<br>");*/
        /*  document.write("U:" + U + "<br>");*/
        $("#calculate_block").append("<br><p align=\"justify\">Suppose that U1 = 0. <br> Solving the equations, we obtain the potentials:</p><br><p>V:" + V + "<br>U:" + U + "</p>");
        $("#calculate_block").append("<p><h2>Checking the plan for optimality by the potential method</h2><br></p><p align=\"justify\">For each free cell of the design, we calculate the differences ΔCij = Cij - (Ui + Vj) and write the obtained values ​​in the lower left corners of the corresponding cells.</p>");
        delta();
        outT(true);
        $("#calculate_block").append("<p align=\"justify\">The design is optimal if all the differencesΔCij ≥ 0. </p>");
        n = optimal();
        if (n[2] == true) {
            $("#calculate_block").append("<p align=\"justify\">Plan - suboptimal (ΔC <sum>" + n[0] + n[1] + "<sum>< 0),and it should be improved by reallocating supplies.<br></p>");
            $("#calculate_block").append("<p align=\"justify\"><h2>Redistribution of supplies</h2></p>");
            $("#calculate_block").append("<p align=\"justify\">Let us find the cell with the largest negative difference ΔCij in absolute value and construct a cycle in which, apart from this cell, all the others are basic. Such a cycle always exists and is unique.</p>");
            permutation(n);
            $("#calculate_block").append("<p align=\"justify\">We again calculate the values ​​of the potentials and the difference ΔCij</p>");
            complete=false;
        }
        else complete = true;
    }
}

if(C!=false)
{
    var Z = 0, s;
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < table[i].length; j++) {
            if (table[i][j] != null) {
                Z += table[i][j] * price[i][j];
            }
        }
    }
   /*document.write("Z=" + Z);*/ $("#calculate_block").append("<p align=\"justify\">The optimal solution was obtained. Let's calculate the total cost of cargo transportation (Z) corresponding to the optimal plan we found.<br></p><p>Z = "+Z+"</p>");

}
}