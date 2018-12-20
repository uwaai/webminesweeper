var load = function(){
	var model = new Model(10, 10, 10);
	var view = new View(
		document.getElementById("ms"),
		document.getElementById("openbtn"),
        document.getElementById("flagbtn"),
        document.getElementById("textarea"),
		model);
};

var View=function(table, openbtn, flagbtn, textarea, model){
	model.addListener(this);
	this.haveFlag = false;
	openbtn.style.backgroundColor = "black";
	flagbtn.style.backgroundColor = "white";
	var view = this;
	openbtn.onclick = function(){
		openbtn.style.backgroundColor = "black";
		flagbtn.style.backgroundColor = "white";
		view.haveFlag = false;
	};
	flagbtn.onclick = function(){
		openbtn.style.backgroundColor = "white";
		flagbtn.style.backgroundColor = "black";
		view.haveFlag = true;
    };
    this.textarea = textarea;
	this.table = table;
	model.update();
};

View.prototype.update = function(model){
	var h = model.h
	var w = model.w;
	var table = this.table;
	//remove all children
	while(table.firstChild){
		table.removeChild(table.firstChild);
	}
	//set row, cell, button or div
	for(var i=0; i<h; i++){
		var row = table.insertRow(-1);
		for(var j=0; j<w; j++){
			var cell = row.insertCell(-1);
			//div
			if(model.isOpened(i, j)){
				var div = document.createElement("div");
				div.innerHTML = this._conv(model.get(i, j));
				cell.appendChild(div);
			//button
			}else{
				var btn = document.createElement("button");
				model.isFlaged(i, j) ? btn.innerHTML = "■" : btn.innerHTML = "□";
				if(model.endstatus==0)btn.onclick = this.onclick(model, i, j);
				cell.appendChild(btn);
			}
		}
    }
    var f = model.bombnum - model.getFlagNum();
    this.textarea.innerHTML = "残り：" + f;
	//win
	if(model.endstatus==1){
		this.textarea.innerHTML = "YOU WIN!!";
	}
	//lose
	if(model.endstatus==2){
		this.table.rows[model.endrow].cells[model.endcell].firstChild.style.backgroundColor = "red";
		this.textarea.innerHTML = "YOU LOSE!!";
	}
};

View.prototype.onclick = function(model, r, c){
	var view = this;
	return function(){
		if(model.isFlaged(r,c)){
			if(view.haveFlag){
				model.removeFlag(r, c);
			}
			else{
				//Do Nothing
			}
		}else{
			if(view.haveFlag){
				model.setFlag(r, c);
			}
			else{
				model.open(r, c);
			}
		}
		model.update();
	};
};

View.prototype._conv = function(number){
	switch(number){
		case -1: return "●";
		case  0: return "□";
		case  1: return "１";
		case  2: return "２";
		case  3: return "３";
		case  4: return "４";
		case  5: return "５";
		case  6: return "６";
		case  7: return "７";
		case  8: return "８";
	}
	return "Ｎ";
};
