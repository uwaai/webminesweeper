var Model = function(w, h, bombnum){
	//init
	this.listeners = [];
	this.w = w;
	this.h = h;
	this.bombnum = bombnum;
	this.clicked = []; //0:close, 1:open, 2:flag
	this.data = [];  //-1:bomb, 0-8:bombnum
	this.endstatus = 0; //0:notEnd, 1:win, 2:lose
	this.endrow = -1;
	this.endcell = -1;
	for(var i=0; i<h+2; i++){
		this.clicked.push([]);
		this.data.push([]);
		for(var j=0; j<w+2; j++){
			this.data[i].push(0);
			this.clicked[i].push(0);
		}
	}
	//bomb set
	var r1 = [];
	for(var i=0; i<w*h;i++){
		r1.push(i);
	}
	for(var i=0; i<bombnum; i++){
		var rind = Math.floor(Math.random()*r1.length);
		var val = r1[rind];
		var rc = val%w;
		var rr = Math.floor(val/w);
		this.data[rr+1][rc+1]=-1;
		r1.splice(rind, 1);
	}
	//number set
	for(var i=1; i<h+1; i++){
		for(var j=1; j<w+1; j++){
			if(this.data[i][j]!=0)continue;
			var ctr = 0;
			if(this.data[i-1][j-1]==-1) ctr++;
			if(this.data[i-1][j  ]==-1) ctr++;
			if(this.data[i-1][j+1]==-1) ctr++;
			if(this.data[i  ][j-1]==-1) ctr++;
			if(this.data[i  ][j+1]==-1) ctr++;
			if(this.data[i+1][j-1]==-1) ctr++;
			if(this.data[i+1][j  ]==-1) ctr++;
			if(this.data[i+1][j+1]==-1) ctr++;
			this.data[i][j] = ctr;
		}
	}
	//outside set
	for(var i=0; i<w+2; i++){
		this.clicked[0][i] = 1;
		this.clicked[h+1][i] = 1;
	}
	for(var i=0; i<h+2; i++){
		this.clicked[i][0] = 1;
		this.clicked[i][w+1] = 1;
	}
};

Model.prototype.out = function(l){
	for(var i=0; i<this.h+2; i++){
		console.log(this.data[i]);
	}
};

Model.prototype.addListener = function(l){
	return this.listeners.push(l);
};

Model.prototype.update = function(){
	var ls = this.listeners;
	for(var i=0; i<ls.length; i++){
		ls[i].update(this);
	}
};

Model.prototype.isOpened = function(r, c){
	return this.clicked[r+1][c+1] == 1;
};

Model.prototype.isFlaged = function(r, c){
	return this.clicked[r+1][c+1] == 2;
};

Model.prototype.get = function(r, c){
	return this.data[r+1][c+1];
};

Model.prototype.open = function(r, c){
	var mr = r+1;
	var mc = c+1;
	if(this.isOpened(r, c))return;
	this.clicked[mr][mc]=1;
	//lose?
	if(this.data[mr][mc]==-1) {
		this.lose(r, c);
		return;
	}
	if(this.data[mr][mc]==0){
		this.open(r+1,c);
		this.open(r-1,c);
		this.open(r,c+1);
		this.open(r,c-1);
	}
	//win?
	if(this.w * this.h - this.getOpenNum() == this.bombnum){
		this.win();
	}
};

Model.prototype.setFlag = function(r, c){
	this.clicked[r+1][c+1]=2;
};

Model.prototype.removeFlag = function(r, c){
	this.clicked[r+1][c+1]=0;
};

Model.prototype.win = function(){
	this.endstatus = 1;
};

Model.prototype.lose = function(r, c){
	this.endstatus = 2;
	this.endrow = r;
    this.endcell = c;
    var w = this.w;
    var h = this.h;
	for(var i=0; i< h+2; i++){
		for(var j=0; j< w+2; j++){
            this.clicked[i][j] = 1;
		}
	}
};

Model.prototype.getOpenNum = function(){
    var ctr = 0;
    var h = this.h;
    var w = this.w;
    for(var i=1; i< h+1; i++){
		for(var j=1; j< w+1; j++){
            if(this.clicked[i][j]==1)ctr++;
		}
    }
    return ctr;
};

Model.prototype.getFlagNum = function(){
    var ctr = 0;
    var h = this.h;
    var w = this.w;
    for(var i=1; i< h+1; i++){
		for(var j=1; j< w+1; j++){
            if(this.clicked[i][j]==2)ctr++;
		}
    }
    return ctr;
};
