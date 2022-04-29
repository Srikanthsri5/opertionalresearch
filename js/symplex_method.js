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
var checker_for_attitude=0;
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
  var Er = document.getElementById('error');
  var inputData = [];
    for (var i = 0; i <=rowsCount; i++){
      var rowData = [];
        for (var j = 0; j <=rowsCount; j++){
          var correctValues = new Boolean(checkValues($("#"+i+"_"+j)));
            if (correctValues == true){
                rowData.push($("#"+i+"_"+j));
                $("#"+i+"_"+j).css("border-color", "#33ff77")
                Er.innerHTML = '';
            } 
            else {
                inputData = null;
                rowData = null; 
                Er.innerHTML = 'Check the correctness of the entered data!';
                $("#"+i+"_"+j).css("border-color", "#ff4d4d")
                break;
            }
            
        }
        if (correctValues == false){
          break;
        }
      inputData.push(rowData);
    }
    if (correctValues == true){
      $("#calculate_button").hide();
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
            mas_buf[i][j]="Basis";
          }
          if(i==0 && j!=0){
            if(j==mas[0].length){
              mas_buf[i][j]="Free member";
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

        
  //PrintComments(0,0,0,0,0);
  //console.log(mas);
  //console.log(mas_buf);
          PrintTable(mas_buf);

          //PrintTable(mas_buf);
  if(bool_check==false){
      do{
        index_row=find_index_row_1(mas);//поиск разрещающей строки
        index_col=find_index_col_1(mas,index_row);//поиск разрешающего столбца
        if(index_col==-1){
          //alert("Так как в строке,с максимальным отрицательным элементом ЗБП нет отрицательных элементов,то система не имеет решений");
          //$("#calculate_block").hide();
          PrintComments(0,0,0,0,5);
          break;
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
      if(index_col==-1){
      PrintComments(0,0,0,0,6);}
      else{
  PrintComments(0,0,0,0,2);
  }
  }
  else{
    if(index_col==-1){
      PrintComments(0,0,0,0,6);}
      else{
  PrintComments(0,0,0,0,2);
  }
  }
  bool_check=false;
  //___________________________алгоритм_2 поиск оптимального решения
  bool_check=verification_of_the_support_solution_2(mas);//первначальная проверка на оптимальность
  if(bool_check==false){
      do{
        if(index_col==-1){break;};
        index_col_2=find_index_col_2(mas);//поиск разрешающего столбца
        index_row_2=find_index_row_2(mas,index_col_2);//поиск разрещающей строки
        if(checker_for_attitude==-1){
          PrintComments(0,0,0,0,7);
          break;
        }
        PrintComments(0,index_row_2,index_col_2,mas,3)
        var mas_2=calculate_new_mas(mas,index_row_2,index_col_2);//расчет новой симплексной таблицы
        mas=mas_2;
        var mas_buf2=array_assembly_change(mas,mas_buf,index_row_2,index_col_2);
        mas_buf=mas_buf2;
        PrintTable(mas_buf);
        bool_check=verification_of_the_support_solution_2(mas);//проверка на оптимальность
      }while(bool_check==false);
    } 
    if(index_col==-1 || checker_for_attitude==-1){
      PrintComments(0,0,0,0,6);
    }
      else{
  PrintComments(mas_buf,0,0,mas,4);
}
}
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
  var k=0;
  var valid_index_col_2=0;
    for(var j=0;j<mas.length-1;j++){
      if(mas[0][j]<k){
        k=mas[0][j];
        valid_index_col_2=j;
      }
    }
    return valid_index_col_2;
}
function find_index_row_2(mas,index_col_2){//поиск разрещающей строки для оптимального решения
  var checker=0;
  var helper=0;
  var min=0;
  var valid_index_row_2=0;
  var simplex_attitude=[];
  simplex_attitude.length=mas.length-1;
    for(var i=1;i<mas.length;i++){
      simplex_attitude[i-1]=mas[i][mas[0].length-1]/mas[i][index_col_2];
    }
    for(var i=0;i<simplex_attitude.length;i++){
      if(simplex_attitude[i]<=0){
        checker++;
      }
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
    if(checker==simplex_attitude.length){
      checker_for_attitude=-1;
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
  var paragraph ="<p align=\"justify\">";
  if(k==0){
    paragraph+="Based on the conditions of the problem, we compose a simplex table. The first line contains the coefficients of the objective function, and if the function is maximized, then the coefficients are taken with the opposite sign. Next, the coefficients of the restrictions are entered, and if the inequalities have a sign> =, then the coefficients are also taken with the opposite sign:</p>";
  }
  if(k==1){
    paragraph+="In our table, there are negative elements in the column of free members. We find the element maximum in absolute value - this is " +mas[index_row][mas.length-1].toFixed(2)+", it specifies the resolving string. In it we also find the element maximum in absolute value - this is "+mas[index_row][index_col].toFixed(2)+", this element is permissive. We recalculate the table:</p>";
  }
  if(k==2){
    paragraph+="Since in the column of free terms all elements are non-negative, the support solution has been found. Let's move on to finding the optimal solution:</p>";
  }
  if(k==3){
    paragraph+="We find in the index line the maximum element in absolute value - this is "+mas[0][index_col].toFixed(2)+". It sets the resolving column. Based on the smallest simplex relation in the column, we find the resolving element - this is "+mas[index_row][index_col].toFixed(2)+",calculating a new simplex table</p>";
  }
  if(k==4){
    paragraph+="Since all elements in the index line are non-negative, the optimal solution has been achieved. Function F value= "+mas[0][mas[0].length-1].toFixed(2)+",with variables:";
    for(var i=0;i<mas_buf.length;i++){//вывод значений x от которых зависит значение функции F
    for(var j=0;j<mas_buf[0].length;j++){
      if(i>1 && j==0){
        var b=mas_buf[i][j].split("");
        if(b[0]=="X"){
          paragraph+=mas_buf[i][j]+"="+mas_buf[i][mas_buf[0].length-1].toFixed(2) + " ";
        }
      }
      }
    }paragraph+=", other variables are not basic and their value is equal to zero.</p>";
  }
  if(k==5){
    paragraph+="Since there are no negative elements in the line with the maximum negative ZBP element, the system has no solutions.</p>";
  }
  if(k==6){
    paragraph+="</p>";
  }
  if(k==7){
    paragraph+="Since in the resolving column of a simplex table all elements are non-positive, it is impossible to select an resolving row. The problem in this case has no solution. The function in the ODZ is not bounded from above and can take arbitrarily large values.</p>";
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

