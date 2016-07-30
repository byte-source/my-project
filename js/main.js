window.onload = function () {
	var template;
	var target = document.getElementById('navigation');
	makeAjax({
		type:"GET",
		url:"templates/navigation.hbs",
		responseType:"text",
		onSuccess:function (response) {
			template = Handlebars.compile(response);
		}
	});
	makeAjax({
		type:"GET",
		url:"stub/navigation.json",
		responseType:"json",
		onSuccess:function (oResponse) {
			var html = template(oResponse);
			target.innerHTML = html;
		},
		onError:function(oResponse){
			console.log(oResponse);
		}
	});
};

function makeAjax (options) {
	var xhttp,response;
	if(window.XMLHttpRequest){
		xhttp = new XMLHttpRequest();
	}else{
		//for IE6 and older
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.onreadystatechange = function () {
		if(xhttp.readyState == 4 && xhttp.status == 200){
			if(options.responseType==="json"){
		    	response = JSON.parse(xhttp.responseText);
		    }else {
				response = xhttp.responseText;
		    }
		    if(typeof(options.onSuccess)==="function"){
		    	options.onSuccess(response)
		    }
		}else if(xhttp.readyState === 4 && xhttp.status !== 200){
			if(typeof(options.onError)==="function"){
		    	options.onError(response)
		    }
		}
	}
	xhttp.onerror = function () {
		debugger;
	}

	xhttp.open(options.type,options.url,true)
	xhttp.send();
};
