var colsCount = 2;
var rowsCount = 0; // Количество ограничений которые вводит пользователь
var max;
var maxY;
var minY;
var minX;
var maxx; // для построения луча
var masColor = ["rgba(255, 204, 204, 0.3)","rgba(204, 255, 255, 0.3)","rgba(230, 204, 255, 0.3)","rgba(179, 179, 255, 0.3)","rgba(193, 193, 215, 0.3)","rgba(164, 193, 193, 0.3)","rgba(0, 128, 0, 0.3)","rgba(0, 64, 128, 0.3)","rgba(82, 82, 122, 0.3)","rgba(153, 102, 0, 0.3)"];
var	valObFunMax = -1;
var valObFunMin = 1000000000000000000000000000000;
var valObFun = [];
var poinsOdz = []; // Массив с данными точек которые входят в ОДЗ при построении графика
var intPoints = []; // Массив точек пересекающихся прямых
var xOy = []; // Массив точек пересечения прямых с осями координат
var check = []; // Массив селектов
var inputData = []; // Мвссив всех введенных данных в строковом формате
var rowData = []; // Временный массив для записи в массив inputData
var canvasData = [];// Массив всех введенных данных без обработки 

function create_table(){
    $("#variable_block").hide();
    $("#constraints_block").hide();
    $("#build_structure").hide();    
	
	var inputDiv = $("#container_for_inputs");
	rowsCount = $("#rows").find(":selected").text();
	colsCount++;
    colsCount++;
    
	//var inputData=[];
    var dataTable = "<table class=\"graphic_table\">";
    //var CFHTML;
	//CFHTML = document.getElementById('data_table');
	
    //generate CF_____________________
    //var rowData=[];
	dataTable += "<td>Objective function:</td>"
    dataTable += "<tr>";
    for (var j = 1; j <= colsCount; j++){
		
        dataTable += "<td>";

        var inputObj = "<input class=\"init_numbers\" size=\"5\" id=\"0_"+j+"\"></input>";
		
        if(j==colsCount){
            inputObj = "<select class=\"selectpicker\" data-size=\"5\" data-width=\"auto\" id=\"0\"><option value =\"min\">min</option><option value =\"max\">max</option></select>";
        }
        //rowData.push($.parseHTML(inputObj));

        if(j != colsCount-1 && j!=colsCount){
            inputObj += " x" + j + " + ";
        }

        dataTable += inputObj;
        dataTable += "</td>";
    }
    dataTable += "</tr>";
    //inputData.push(rowData);
    var br=document.createElement("br");
	
    container_for_inputs.appendChild(br);
	
    //___________________________________
    
    //generate dataTable________________ 
	
	for (var i =1;i<=rowsCount;i++){
		if (i==1){
		dataTable += "<td>Limitations:</td>";
		}
		//var rowData=[];
        dataTable += "<tr>";
		for(var j=1;j<=colsCount;j++){
			
			dataTable += "<td>";            
            
			var inputObj = "<input class=\"init_numbers\" size=\"5\" id=\""+i+"_"+j+"\"></input>";
            
            if(j == colsCount){
                inputObj = "<input class=\"init_numbers\" size=\"5\" id=\""+i+"_"+(j-1)+"\"></input>";
            }
            
			if(j==colsCount-1){
                inputObj = "<select class=\"selectpicker\" data-size=\"5\" data-width=\"auto\" id=\""+i+"\"><option value =\"<=\"><=</option><option value =\">=\">>=</option></select>";
			}
            //rowData.push($.parseHTML(inputObj));
            
            if(j != colsCount && j != colsCount-1 && j!=colsCount-2){
                inputObj += " x" + j + " + ";
            } else if (j==colsCount-2){
                inputObj += " x" + j;
            }
            
            dataTable += inputObj;
            dataTable += "</td>";
						
		}
        dataTable += "</tr>";
		//inputData.push(rowData);
		/*var br=document.createElement("br");
		container_for_inputs.appendChild(br);*/
	}
    dataTable += "</table>";
    $("#data_table").show();
    $("#data_table").append(dataTable);
	
    //console.log(inputData);
    //______________________________________
    
    
    $("#calculate_button").attr("type","button");
    $('.selectpicker').selectpicker('refresh');
}

function calculate(){
    //if already existing calculations
    if (canvasData.length > 0){
        valObFunMax = -1;
        valObFunMin = 1000000000000000000000000000000;
        valObFun = [];
        poinsOdz = []; // Массив с данными точек которые входят в ОДЗ при построении графика
        intPoints = []; // Массив точек пересекающихся прямых
        xOy = []; // Массив точек пересечения прямых с осями координат
        check = []; // Массив селектов
        inputData = []; // Мвссив всех введенных данных в строковом формате
        rowData = []; // Временный массив для записи в массив inputData
        canvasData = [];
        
        $("#conclusion").empty();
        $("#chart_button").removeClass("active");
        $("#error").text("");
    }
    //if true clear them all, clear page
    //if false
	var Er = document.getElementById('error');
    var inputData = [];    
    for(var i=0;i<parseFloat(rowsCount)+1;i++){//приведение к нормальному виду для дальнейшей работы
        check[i]=$("#"+i).val();
    }
    for (var i = 0; i <= rowsCount; i++){
        var rowData = [];
        for (var j = 1; j < colsCount; j++){
            var correctValues = new Boolean(checkValues($("#"+i+"_"+j)));
            if (correctValues == true){
                rowData.push($("#"+i+"_"+j));
                $("#"+i+"_"+j).css("border-color", "#33ff77")
                Er.innerHTML = '';
            } else {
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

    for (var i = 0; i < rowsCount; i++){

    }
    for (var i = 0; i <= rowsCount; i++){
            canvasData.push([parseFloat(inputData[i][0][0].value), parseFloat(inputData[i][1][0].value), parseFloat(inputData[i][2][0].value)]);
    }
    var x1, x2;
    if (rowsCount != 1 && rowsCount !=0){
    	var i = 1;
    	for (var i = 1; i < rowsCount; i++){
    		for (var n = 1; n <= rowsCount; n++){
    			if (i!=n){
    				x1 = ((canvasData[i][2]*canvasData[n][1])-(canvasData[i][1]*canvasData[n][2]))/((canvasData[i][0]*canvasData[n][1])-(canvasData[i][1]*canvasData[n][0]));
    				x2 = ((canvasData[i][0]*canvasData[n][2])-(canvasData[i][2]*canvasData[n][0]))/((canvasData[i][0]*canvasData[n][1])-(canvasData[i][1]*canvasData[n][0]));
    				intPoints.push([x1,x2]);
    			}
    		}
    	}
	}

	// Удаление повторяющихся точек из массива
	//___________________________________________________________

	var newArr = [];
	var i = intPoints.length -1;
	var tmp = {};

	for (; i>=0; i--){
		if (intPoints[i] in tmp) continue;
		newArr.push(intPoints[i]);
		tmp[intPoints[i]] = 1;
	}

	intPoints = newArr.reverse();

	// Заполнение массива данными о пересечении прямых с осями OX OY
	// _____________________________________________________________
	var rows = parseFloat(rowsCount);
	for (var i = 1; i < rows + 1; i++){
        xOy.push([0, (canvasData[i][2]/canvasData[i][1])]);
        xOy.push([(canvasData[i][2]/canvasData[i][0]), 0]);
    }
    xOy.push([0,0]);
    // Нахождение максимальной координаты по оси OX и ОY и минимального по OY для красивого закрашивания графика
    // ____________________________________________
    max = -10;
    maxx = -10;
    maxY = -1;
    minY = 0;
    minX = 0;
    
    // Объединение intPoints и xOy для проверки точек на ОДЗ
    //______________________________________________________
    for (var i=0; i<xOy.length; i++){
    	intPoints.push(xOy[i]);
    }
    for (var i = 0; i < intPoints.length; i++){
        if (intPoints[i][0]>max){
        	max = intPoints[i][0];
        }
    }
    for (var i = 0; i < intPoints.length; i++){
        if (intPoints[i][1]>maxY){
        	maxY = intPoints[i][1];
        }
    }
    for (var i = 0; i <intPoints.length; i++){
    	if (intPoints[i][1]<minY){
    		minY = intPoints[i][1];
    	}
    }
    for (var i = 0; i <intPoints.length; i++){
    	if (intPoints[i][0]<minX){
    		minX = intPoints[i][0];
    	}
    }
    // Проверка точек на ОДЗ
    //______________________
    var z; // счетчик
    for (var i = 0; i < intPoints.length; i++){
    	z = 0;
    	for (var j = 1; j < rows + 1; j++){
    		if (check[j] == ">=" && intPoints[i][0] >= 0 && intPoints[i][1] >= 0){
    			if ((((canvasData[j][0]*intPoints[i][0])*1000+(canvasData[j][1]*intPoints[i][1])*1000)/1000).toFixed(5)>=canvasData[j][2]){
    				z++;
    			}
    		}
    		if (check[j] == "<=" && intPoints[i][0] >= 0 && intPoints[i][1] >= 0){
    			if ((((canvasData[j][0]*intPoints[i][0])*1000+(canvasData[j][1]*intPoints[i][1])*1000)/1000).toFixed(5)<=canvasData[j][2])
    			{
    				z++;
    			}
    		}
    	}
    	if (z === rows){
    		poinsOdz.push([intPoints[i][0], intPoints[i][1]]);
    	}
    }
    for (var i = 0; i < poinsOdz.length; i++){//для построение луча нахождение самого максимального X'a
        if (poinsOdz[i][0]>maxx){
        	maxx = poinsOdz[i][0];
        }
    }
    // Поиск максимума или минимума, в зависемости от выбора пользователя
    //___________________________________________________________________
    

    if (check[0]=="max"){
    	for (var i = 0; i<poinsOdz.length; i++){
    		if ((canvasData[0][0]*poinsOdz[i][0]+canvasData[0][1]*poinsOdz[i][1]) > valObFunMax)
    		{
    			valObFun = ([poinsOdz[i][0], poinsOdz[i][1]]);
    			valObFunMax = (canvasData[0][0]*poinsOdz[i][0]+canvasData[0][1]*poinsOdz[i][1]);
    		}
    	}
    	var k = 0; // счетчик
    		for (var j = 1; j < rows + 1; j++){
    				//k = 0;
    				if (check[j] == ">="){
    					if (((canvasData[j][0]*valObFun[0])+(canvasData[j][1]*(valObFun[1]+100)))>=canvasData[j][2]){
    						k++;
    					}
    				}
    				if (check[j] == "<="){
    					if (((canvasData[j][0]*valObFun[0])+(canvasData[j][1]*(valObFun[1]+100)))<=canvasData[j][2]){
    						k++;
    					}
    				}
    				if (k === rows){
    				if ((canvasData[0][0]*valObFun[0]+canvasData[0][1]*(valObFun[1]+100)) > valObFunMax){
    					valObFunMax = "The maximum point goes to infinity";
    				}
    			}
    		}
    		k = 0;
    		for (var j = 1; j < rows + 1; j++){
    				//k = 0;
    				if (check[j] == ">="){
    					if (((canvasData[j][0]*(valObFun[0]+100))+(canvasData[j][1]*(valObFun[1])))>=canvasData[j][2]){
    						k++;
    					}	
    				}
    				if (check[j] == "<="){
    					if (((canvasData[j][0]*(valObFun[0]+100))+(canvasData[j][1]*(valObFun[1])))<=canvasData[j][2]){
    						k++;
    					}
    				}
    				if (k === rows){
    				if ((canvasData[0][0]*(valObFun[0]+100)+canvasData[0][1]*valObFun[1]) > valObFunMax){
    					valObFunMax = "The maximum point goes to infinity";
    				}
    			}
    		}
    		console.log(((canvasData[1][0]*(valObFun[0]+100))+(canvasData[1][1]*(valObFun[1]))));
    		console.log(valObFun[1]);
    		console.log(typeof valObFun[0]);
    }

    if (check[0]=="min"){
    	for (var i = 0; i<poinsOdz.length; i++){
    		if ((canvasData[0][0]*poinsOdz[i][0]+canvasData[0][1]*poinsOdz[i][1]) < valObFunMin)
    		{
    			valObFun = [poinsOdz[i][0], poinsOdz[i][1]];
    			valObFunMin = (canvasData[0][0]*poinsOdz[i][0]+canvasData[0][1]*poinsOdz[i][1]);
    		}
    	}
    }


	//var value = inputData[1][1][0].value;
	//console.log(valObFun);
	//console.log((3*1.6*10+2*0.6*10)/10);
	//console.log((1.6*10+4*0.6*10)/10);
	console.log(valObFunMin);
	console.log(valObFunMax);
    console.log(intPoints);
    console.log(poinsOdz);
    //console.log(max);
    //console.log(xOy);
    //console.log(canvasData);
    //console.log(check);
    //console.log(poinsOdz);
    //console.log(maxY);
    //console.log(rowsCount);
    //console.log(typeof value);
    //console.log(inputData[1][2]);
    //console.log(canvasData);
    
    $("#chart_button").attr("type","button");
}







function doFlot(){
    //check if class active
    if ($("#chart_button").hasClass("active")){
        $("#error").text("The solution has already been built! Refresh your data or update your solution.");
        return false;
    }
    $("#chart_button").addClass("active");
		var rows = parseFloat(rowsCount);
        var testArray = canvasData;
        var chartConfig = {};
        var all_data = [];
        var timeArray = [];
        var xyOS = [];// массив с прямыми X Y
        if (max<(minX*(-1))){
        	xyOS.push([minX, 0]);
        	xyOS.push([minX*(-1), 0]);
        }else{
        	xyOS.push([max*(-1), 0]);
        	xyOS.push([max, 0]);
        }
        if (maxY<(minY*(-1))){
        	xyOS.push([0,minY]);
        	xyOS.push([0,minY*(-1)]);
        }else{
        	xyOS.push([0,maxY*(-1)]);
        	xyOS.push([0,maxY]);
        }
        for (var i=1; i<rows + 1; i++){
        	if (testArray[i][0] < 0){
        		all_data.push([max, ((testArray[i][2]-((testArray[i][0]*max)))/testArray[i][1])]);
            	all_data.push([(testArray[i][2]/testArray[i][0]), 0]);
            	//break;
        	}
        	if (testArray[i][1] < 0){
        		all_data.push([0, (testArray[i][2]/testArray[i][1])]);
            	all_data.push([max, ((testArray[i][2]-((testArray[i][0]*max)))/testArray[i][1])]);
            	//break;
        	}
        	if (testArray[i][0] > 0 && testArray[i][1] > 0){
            	all_data.push([0, (testArray[i][2]/testArray[i][1])]);
            	all_data.push([(testArray[i][2]/testArray[i][0]), 0]);
        	}
        }
        for (var i = 1; i < rows + 1; i++){
        	if (testArray[i][1]>0 && check[i]==">="){
        		timeArray[i-1]=maxY;
        	}
        	if (testArray[i][1]<0 && check[i]==">="){
        		timeArray[i-1]=minY;
        	}
        	if (testArray[i][1]<0 && check[i]=="<="){
        		timeArray[i-1]=maxY;
        	}
        	if (testArray[i][1]>0 && check[i]=="<="){
        		timeArray[i-1]=minY;
        	}
        }
        $("#conclusion").show();
        var plusMine = '+'; // плюс иди мигус в вывод перед x2
        var datasets = {};
        var j = 2;
        var k = 0;
        var m = 0;
        var data = [];
        var conclusionHtml;
        console.log(timeArray[0]);
        console.log(timeArray[1]);
        var rows = parseFloat(rowsCount);
        var perp = {}; // перпендикуляр
        var gradient = {};
        var pointsets = {}; // область с точками для одз
        var pointData = []; // массив с областью для построения графика
        conclusionHtml = document.getElementById('conclusion');
        var str = ""+conclusionHtml.clientWidth*0.75+"";
        console.log(str);
        if (valObFunMax!="The maximum point is at infinity" || (valObFunMax === -1 && valObFunMin === 1000000000000000000000000000000)){
        	perp[0] = { lines: {show: true}, label: "Perpendicular", grid: { hoverable: true, clickable: true, autoHighlight: true }, color: 3, data:  [[((-maxY/2)*canvasData[0][1]+valObFun[1]*canvasData[0][1]+valObFun[0]*canvasData[0][0])/canvasData[0][0], maxY/2], [((maxY/2)*canvasData[0][1]+valObFun[1]*canvasData[0][1]+valObFun[0]*canvasData[0][0])/canvasData[0][0], -maxY/2]]};
        }
        gradient[0] = { lines: {show: true}, label: "Gradient", grid: { hoverable: true, clickable: true, autoHighlight: true }, color: 2, data:  [[0, 0], [ max, (canvasData[0][1]/canvasData[0][0])*max]]};
        for (var i = 0; i < poinsOdz.length; i++){
        	if ((i+1)===poinsOdz.length){
        		pointsets[k]= { lines: {show: false, fill: true}, points : { show : true, radius: 5}, grid: { hoverable: true, clickable: true, autoHighlight: true }, color: 'rgba(0, 0, 0, 1)', data:  [[poinsOdz[i][0], poinsOdz[i][1]], [poinsOdz[0][0], poinsOdz[0][1]]]};
        }else{
        	pointsets[k]= { lines: {show: false, fill: true}, points : { show : true, radius: 5}, grid: { hoverable: true, clickable: true, autoHighlight: true }, color: 'rgba(0, 0, 0, 1)', data:  [[poinsOdz[i][0], poinsOdz[i][1]], [poinsOdz[i+1][0], poinsOdz[i+1][1]]]};
        }
        	pointData.push(pointsets[k]);
        	k++;
        	i++
        	;
        }
        k = 0;
        datasets[0] = {color:1, data : [[xyOS[0][0], xyOS[0][1]], [xyOS[1][0],xyOS[1][1]]]};
        datasets[1] = {color:1, data : [[xyOS[2][0], xyOS[2][1]], [xyOS[3][0],xyOS[3][1]]]};
        data[0]=datasets[0];
        data[1]=datasets[1];
        for (var i = 0; i < rowsCount*2; i=i+2){
        	datasets[j] = { lines: {show: true, fill: true, fillColor: masColor[k]}, label: "Limitation"+(k+1), grid: { hoverable: true, clickable: true, autoHighlight: true }, points : { show : true}, color: masColor[k], data:  [[all_data[i][0], all_data[i][1], timeArray[k]], [all_data[i+1][0], all_data[i+1][1], timeArray[k]]]};
        	j++;
        	k++;
        }
        conclusionHtml.innerHTML += '<p><b>Decision:</b> The points whose coordinates simultaneously satisfy all the inequalities of the system of constraints are called the region of feasible solutions. Obviously, to find the region of feasible solutions to a given problem, it is necessary to consider each inequality sequentially. The last step serves directly to get the answer. This is a standard solution scheme. Substituting the coordinates of any point A (x1, x2), belonging to the region of feasible solutions, into the expression of the objective function, one can obtain the value of the function at this point A. By the condition of the problem: x1 ≥ 0 x2 ≥ 0.</p>';
    
        for (var i = 0; i < rows+2; i++){
        	conclusionHtml.innerHTML += '<div class=\"flot_wrapper\" id="placeholder'+i+'" style="margin: 25px auto;width: '+str+'px; height: '+str+'px;"></div>';
        	if (i!=rows && i!=rows+1){
        		if (canvasData[i+1][1]<0)
        			plusMine = '';
        		conclusionHtml.innerHTML += '<p>Consider the inequality'+(i+1)+' systems of restrictions.</p>';
        		conclusionHtml.innerHTML += '<p>'+canvasData[i+1][0]+'*x1'+plusMine+canvasData[i+1][1]+'*x2'+check[i+1]+' '+canvasData[i+1][2]+'</p>';
        		conclusionHtml.innerHTML += '<p>Lets build a straight line '+canvasData[i+1][0]+'*x1'+plusMine+canvasData[i+1][1]+'*x2 = '+canvasData[i+1][2]+'</p>';
        		conclusionHtml.innerHTML += '<p>Found the coordinates of two points belonging to this line: ('+all_data[m][0].toFixed(2)+'; '+all_data[m][1].toFixed(2)+') , ('+all_data[m+1][0].toFixed(2)+'; '+all_data[m+1][1].toFixed(2)+'). We connect them and get the necessary straight line.</p>';
        		if (canvasData[i+1][1]<0 && check[i+1]=='<=')
        			conclusionHtml.innerHTML += '<p>In this case, we are interested in the range of values ​​above the constructed line</p>';
        		if (canvasData[i+1][1]<0 && check[i+1]=='>=')
        			conclusionHtml.innerHTML += '<p>In this case, we are interested in the range of values ​​below the constructed straight line</p>';
        		if (canvasData[i+1][1]>0 && check[i+1]=='<=')
        			conclusionHtml.innerHTML += '<p>In this case, we are interested in the range of values ​​below the constructed straight line</p>';
        		if (canvasData[i+1][1]>0 && check[i+1]=='>=')
        			conclusionHtml.innerHTML += '<p>In this case, we are interested in the range of values ​​above the constructed line</p>';
        		if (canvasData[i+1][1]==0)
        			conclusionHtml.innerHTML += '<p>In this case, we are interested in the range of values ​​on the constructed line</p>';
        	}
        	m=m+2;
        	plusMine = '+';
        	if (i == rows && poinsOdz.length != 0){
        		conclusionHtml.innerHTML += '<p>Black dots - dots included in ODZ functions</p>';
        	}else if (i == rows && poinsOdz.length == 0){
        		conclusionHtml.innerHTML += '<p>There is not a single point included in the LDZ</p>';
        	}
        	if (i == rows+1){
        		if (check[0]=='max' && poinsOdz.length != 0 && valObFunMax != "The maximum point goes to infinity"){
        			conclusionHtml.innerHTML += '<p>The maximum of the function is reached at the point('+valObFun[0].toFixed(2)+'; '+valObFun[1].toFixed(2)+')</p>';
        			conclusionHtml.innerHTML += '<p>F(max) = '+valObFunMax.toFixed(2)+'</p>';
        		}else if (check[0]=='max' && poinsOdz.length == 0 && valObFunMax != "The maximum point goes to infinity"){
        			conclusionHtml.innerHTML += '<p>Since the ODZ is empty, there are no solutions!</p>';
        		}else if (check[0]=='max' && poinsOdz.length != 0 && valObFunMax == "The maximum point goes to infinity"){
        			conclusionHtml.innerHTML += '<p>'+valObFunMax+'</p>';
        		}
        		if (check[0]=='min' && poinsOdz.length != 0){
        			conclusionHtml.innerHTML += '<p>The minimum of the function is attained at the point('+valObFun[0].toFixed(2)+'; '+valObFun[1].toFixed(2)+')</p>';
        			conclusionHtml.innerHTML += '<p>F(min) = '+valObFunMin.toFixed(2)+'</p>';
        		}else if(check[0]=='min' && poinsOdz.length == 0){
        			conclusionHtml.innerHTML += '<p>Since the ODZ is empty, there are no solutions!</p>';
        		}
        	}
        }
        for (var i = 2 ; i < rows + 2 ; i++){
        	data.push(datasets[i]);
        		$.plot($("#placeholder"+(i-2)), data);
        		//var plotId = "#placeholder"+(i-2);
        		//console.log(plotId);
        }
/*$("#placeholder0").on("plotclick", function (event, pos, item) {
    			console.log("You hovered at " + pos.x + ", " + pos.y);

    				if (item) {
        				highlight(item.series, item.datapoint);
        				console.log("You hovered a point!");
    				}
				});*/
        for (var i = 0 ; i < pointData.length ; i++){
        	data.push(pointData[i]);
        }$.plot($("#placeholder"+(rows)), data);
        if(valObFunMax != "The maximum point goes to infinity"){
        data.push(perp[0]);
    }
        data.push(gradient[0]);
        $.plot($("#placeholder"+(rows+1)), data);
        console.log(valObFunMax);
        console.log(maxY);
        console.log(minY);
        console.log(canvasData[0][0]);
        console.log(canvasData[0][1]);
    //clickable false
}



function checkValues(input){
    var regExpForCheckNumbers = /-?\d+\.?\d*$/;
    return regExpForCheckNumbers.test(input.val());
}
