var colsCount = 0;
var rowsCount = 0;
var inputData = [];
var rowData = [];
var mas=[];
var mas_buf=[];
var index_row=0;
var index_col=0;
var index_row_2=0;
var index_col_2=0;
var mas_row;
var mas_col;
var bool_check=false;
function create_table(){
  $("#variable_block").hide();
  $("#constraints_block").hide();
  $("#build_structure").hide();    
	
	var inputDiv = $("#container_for_inputs");
	colsCount = $("#cols").find(":selected").text();
	rowsCount = $("#rows").find(":selected").text();
	colsCount++;
  colsCount++;
  var dataTable = "<table class=\"symplex_init_table\">";
  //generate CF_____________________
  dataTable += "<tr>";
    for (var j = 1; j <= colsCount; j++){
      dataTable += "<td>";
      var inputObj = "<input class=\"init_numbers\" size=\"5\" id=\"0_"+(j-1)+"\"></input>";
      if(j==colsCount){
        inputObj = "<select class=\"selectpicker\" data-size=\"5\" data-width=\"auto\" id=\"0\"><option value =\"min\">min</option><option value =\"max\">max</option></select>";
      }
      if(j != colsCount-1 && j!=colsCount){
        inputObj += " x" + j + " + ";
      }
      dataTable += inputObj;
      dataTable += "</td>";
    }
  dataTable += "</tr>";
  var br=document.createElement("br");
  container_for_inputs.appendChild(br);
    //generate dataTable________________    
	  for (var i =1;i<=rowsCount;i++){
      dataTable += "<tr>";
  		for(var j=1;j<=colsCount;j++){
  			dataTable += "<td>";
        var inputObj = "<input class=\"init_numbers\" size=\"5\" id=\""+i+"_"+(j-1)+"\"></input>";
          if(j == colsCount){
            inputObj = "<input class=\"init_numbers\" size=\"5\" id=\""+i+"_"+(j-2)+"\"></input>";
          }   
  			  if(j==colsCount-1){
            inputObj = "<select class=\"selectpicker\" data-size=\"5\" data-width=\"auto\" id=\""+i+"\"><option value =\"<=\"><=</option><option value =\">=\">>=</option></select>";
  			  }
          if(j != colsCount && j != colsCount-1 && j!=colsCount-2){
            inputObj += " x" + j + " + ";
          }
          else
           if (j==colsCount-2){
              inputObj += " x" + j;
            }
        dataTable += inputObj;
        dataTable += "</td>";
  						
  		}
      dataTable += "</tr>";
	    /*var br=document.createElement("br");
	    container_for_inputs.appendChild(br);*/
	  }
  dataTable += "</table>";
  $("#data_table").show();
  $("#data_table").append(dataTable);
  $("#calculate_button").attr("type","button");
    $('.selectpicker').selectpicker('refresh');
}

function calculate(){
  $("#calculate_button").hide();
  var inputData = [];
    for (var i = 0; i <= rowsCount; i++){
      var rowData = [];
        for (var j = 1; j < colsCount; j++){
          var correctValues = new Boolean(checkValues($("#"+i+"_"+j)));
            if (correctValues == true){
                rowData.push($("#"+i+"_"+j));
                $("#"+i+"_"+j).css("border-color", "#33ff77")
            } 
            else {
                inputData = null;
                rowData = null;
                $("#"+i+"_"+j).css("border-color", "#ff4d4d")
                break;
            }
            
        }
        if (correctValues == false){
          break;
        }
      inputData.push(rowData);
    }
  var helper=++rowsCount;
  rowsCount=helper;
  helper=colsCount;
  colsCount=helper;
  var n = rowsCount, m = colsCount-1;//create mas
  var mas = [];
    for (var i = 0; i < n; ++i){
      mas[i] = [];

        for (var j = 0; j < m; j++){
          elem=$("#" + i + "_" + j).val();
          mas[i][j]=parseFloat(elem);
        }
    }
    for(var i=0;i<rowsCount;i++){//приведение к нормальному виду для дальнейшей работы
      var check=$("#"+i).val();
        if(check==">=" || check=="max" ){
          for(var j=0;j<colsCount-1;j++){
            k=-mas[i][j];
            mas[i][j]=k;
          }
        }
    }
   for (var i = 0; i < (1+n); ++i){//создание массива сборщика(с подписями)
      mas_buf[i] = [];
        for (var j = 0; j < (1+m); j++){
          mas_buf[i][j]=0;
          if(i==0 && j==0){
            mas_buf[i][j]="Базис";
          }
          if(i==0 && j!=0){
            if(j==mas[0].length){
              mas_buf[i][j]="Cвободный член";
            }
            else{
              mas_buf[i][j]="X"+j;
            }
          }
          if(i!=0 && j==0){
            if(i==1 && j==0){
              mas_buf[i][j]="F";
            }
            else{
              mas_buf[i][j]="Y"+(i-1);
            }
          }
          if(i!=0 && j!=0){
            mas_buf[i][j]=mas[i-1][j-1];
          }
        }
    }
  mas_row=rowsCount-1;
  mas_col=colsCount-2;
  //___________________________алгоритм_1 поиск опорного решения
  bool_check=verification_of_the_support_solution_1(mas,mas_col);//первначальная проверка на опорность
  PrintComments(0,0,0,0,0);
  //console.log(mas);
  //console.log(mas_buf);
  PrintTable(mas_buf);
  if(bool_check==false){
      do{
        index_row=find_index_row_1(mas);//поиск разрещающей строки
        index_col=find_index_col_1(mas,index_row);//поиск разрешающего столбца
        if(index_col==-1){
          alert("Так как в строке,с максимальным отрицательным элементом ЗБП нет отрицательных элементов,то система не имеет решений");
          $("#calculate_block").hide();
        }
        PrintComments(0,index_row,index_col,mas,1);
        var mas_1=calculate_new_mas(mas,index_row,index_col);//расчет новой симплексной таблицы
        mas=mas_1;
        //console.log(mas);
        var mas_buf1=array_assembly_change(mas,mas_buf,index_row,index_col);
        mas_buf=mas_buf1;
        //console.log(mas_buf);
        PrintTable(mas_buf);
        bool_check=verification_of_the_support_solution_1(mas,mas_col);//проверка на опорность
      }while(bool_check==false);
      PrintComments(0,0,0,0,2);
  }
  else{
  PrintComments(0,0,0,0,2);
  }
  bool_check=false;
  //___________________________алгоритм_2 поиск оптимального решения
  bool_check=verification_of_the_support_solution_2(mas);//первначальная проверка на оптимальность
  if(bool_check==false){
      do{
        index_col_2=find_index_col_2(mas);//поиск разрешающего столбца
        index_row_2=find_index_row_2(mas,index_col_2);//поиск разрещающей строки
        PrintComments(0,index_row_2,index_col_2,mas,3)
        var mas_2=calculate_new_mas(mas,index_row_2,index_col_2);//расчет новой симплексной таблицы
        mas=mas_2;
        var mas_buf2=array_assembly_change(mas,mas_buf,index_row_2,index_col_2);
        mas_buf=mas_buf2;
        PrintTable(mas_buf);
        bool_check=verification_of_the_support_solution_2(mas);//проверка на оптимальность
      }while(bool_check==false);
    } 
  PrintComments(mas_buf,0,0,mas,4);

}
function checkValues(input){//проверка правильности введенных данных
  var regExpForCheckNumbers = /-?\d+\.?\d*$/;
  return regExpForCheckNumbers.test(input.val());
}
function find_index_row_1(mas){//поиск разрешающей строки для опорного решения
  var k=0;
  var valid_index_row=-1;
    for(var i=1;i<=mas_row;i++){
      if(mas[i][mas_col]<k){
        k=mas[i][mas_col];
        valid_index_row=i;
      }
    }
  return valid_index_row;
}
function find_index_col_1(mas,index_row){//поиск разрешающего столбца для опорного решения
  var k=0;
  var valid_index_col=-1;
    for(var j=0;j<mas_col;j++){
      if(mas[index_row][j]<k){
        k=mas[index_row][j];
        valid_index_col=j;
      }
    }
  return valid_index_col;
}
function calculate_new_mas(mas,index_row,index_col){//расчет массива значений
  var new_mas = [];
    for (var i = 0; i < mas.length; i++){
      new_mas.push([]);
      for (var j = 0; j < mas[0].length; j++){
        if(i==index_row && j==index_col){
          new_mas[i][j]=1/mas[i][j];
        }
        else  
          if(j==index_col){
          new_mas[i][j]=-mas[i][j]/mas[index_row][index_col];
          }
        else
          if(i==index_row){
           new_mas[i][j]=mas[i][j]/mas[index_row][index_col];
          }
        else
          new_mas[i][j]=mas[i][j]-(mas[i][index_col]*mas[index_row][j]/mas[index_row][index_col]);
        }
    } 
    return new_mas;
}
function verification_of_the_support_solution_1(mas,mas_col){//проверка на опорность
  var check=0;
    for(var i=1;i<mas.length;i++){
      if(mas[i][mas_col]>=0){
      check++;
      }
    }
    if(check==mas.length-1){
    return true;
    }
    else
      return false;
}
function find_index_col_2(mas){//поиск разрешающего столбца для оптимального решения
  var checker=0;
  var k=0;
  var valid_index_col_2=0;
    for(var j=0;j<mas.length-1;j++){
      if(mas[0][j]<k){
        k=mas[0][j];
        valid_index_col_2=j;
      }
      else
      if(mas[0][j]>=k){
        checker++;
      }
    }
    if(checker==mas.length-1){
      alert("Система не имеет решений");
    }
    return valid_index_col_2;
}
function find_index_row_2(mas,index_col_2){//поиск разрещающей строки для оптимального решения
  var helper=0;
  var min=0;
  var valid_index_row_2=0;
  var simplex_attitude=[];
  simplex_attitude.length=mas.length-1;
    for(var i=1;i<mas.length;i++){
      simplex_attitude[i-1]=mas[i][mas[0].length-1]/mas[i][index_col_2];
    }
    for(var i=0;i<simplex_attitude.length;i++){
      if(simplex_attitude[i]>0){
        helper=simplex_attitude[i];
      }
    }
    for(var i=0;i<simplex_attitude.length;i++){
      if(simplex_attitude[i]>0 && helper>=simplex_attitude[i]){
        helper=simplex_attitude[i];
        min=i;
      }
    }
  valid_index_row_2=++min;
  return valid_index_row_2;
}
function verification_of_the_support_solution_2(mas){//проверка на оптимальность
  var check=0;
    for(var j=0;j<mas.length-1;j++){
      if(mas[0][j]>=0){
        check++;
      }
    }
    if(check==mas.length-1){
      return true;
    }
    else
      return false;
}
function PrintTable(mas_buf){//вывод готовой таблицы
  var tableViev = "<table class=\"symplex_table\">";
  for (var i = 0 ; i < mas_buf.length; i++){
    tableViev += "<tr>";
    for (var j = 0; j < mas_buf[i].length; j++) {
      if(i!=0 && j!=0){
        tableViev += "<td><br><div align=\"center\" style=\"width: 10vh;\">" +mas_buf[i][j].toFixed(2)+ "</div><br></td>";
      }
      else{
        if(i==0 && j==mas_buf.length-1)
      {
       tableViev += "<td><br><div align=\"center\" style=\"width: 11vh;\">"+mas_buf[i][j]+"</div><br></td>";
      }
      else{
        tableViev += "<td><br><div align=\"center\" style=\"width: 10vh;\">"+mas_buf[i][j]+"</div><br></td>";
      }
      }
    }
    tableViev += "</tr>";
  }
  tableViev += "</table></div>";
  $("#calculate_block").show();
  $("#calculate_block").append(tableViev); 
}
function PrintComments(mas_buf,index_row,index_col,mas,k){//добавление комментариев к таблице 
  var paragraph ="<p>";
  if(k==0){
    paragraph+="Исходя из условий задачи составляем симплексную таблицу.В первую строку заносятся коэффициенты целевой функции,причем,если функция максимизируется,то коэфиициенты берутся с противоположным знаком.Далее заносятся коэффициенты ограничений,причем,если у неравенств знак >= ,то коэффициенты также берутся с противоположным знаком</p>";
  }
  if(k==1){
    paragraph+="В составленной нами таблице в столбце свободных членов имеются отрицательные элементы.Находим максимальный по модулю элемент-это " +mas[index_row][mas.length-1].toFixed(2)+" Он задает разрешающую строку.В ней также находим максимальный по модулю элемент -это "+mas[index_row][index_col].toFixed(2)+" Этот элемент является разрешающим.Пересчитываем таблицу</p>";
  }
  if(k==2){
    paragraph+="Так как в столбце свободных членов все элементы неотрицательны,то опорное решение найдено.Переходим к поиску оптимального решения</p>";
  }
  if(k==3){
    paragraph+="Находим в индексной строке максимальный по модулю элемент - это "+mas[0][index_col].toFixed(2)+". Он задает разрешающий столбец.Исходя из наименьшего симплексного отношения в столбце находим разрешающий элемент - это "+mas[index_row][index_col].toFixed(2)+". Расчитываем новую симплексную таблицу</p>";
  }
  if(k==4){
    paragraph+="Так как в индексной строке все элементы неотрицательны,то оптимальное решение достигнуто.Значение функции F= "+mas[0][mas[0].length-1].toFixed(2)+" при переменных: ";
    for(var i=0;i<mas_buf.length;i++){//вывод значений x от которых зависит значение функции F
    for(var j=0;j<mas_buf[0].length;j++){
      if(i>1 && j==0){
        var b=mas_buf[i][j].split("");
        if(b[0]=="X"){
          paragraph+=mas_buf[i][j]+"="+mas_buf[i][mas_buf[0].length-1].toFixed(2) + " ";
        }
      }
      }
    }paragraph+=", остальные переменные не базисные и их значение равно нулю.</p>";
  }
  $("#calculate_block").append(paragraph);
}
function array_assembly_change(mas,mas_buf,index_row,index_col){//меняет элемент X Y по надобности и обновляет выводной массив 
  var trans=0;
  if(index_row!=undefined && index_col!=undefined){
    trans=mas_buf[0][1+index_col];
    mas_buf[0][1+index_col]=mas_buf[1+index_row][0];
    mas_buf[1+index_row][0]=trans;
  }
  for(var i=0;i<mas_buf.length;i++){
    for(var j=0;j<mas_buf[0].length;j++){
      if(i!=0 && j!=0){
        mas_buf[i][j]=mas[i-1][j-1];
      }
    }
  }
  return mas_buf;
}
