

//"use strict";

class DrawBoard{
	constructor(){
		this.canvas = document.getElementById("board");
		this.ctx = this.canvas.getContext('2d');

		
		this.settings = {
			width : 500,
			height : 500,
			line_thicknes : 3,
			fgcolor : "#808080",
			bgcolor : "white",
			undo_max_buffer_size : 5,
			scale : 1
		}

		this.__data = {
			stack : [],
			lines_hist: [],
			pointer : 0,
			mouseclicked : false
		}
		// this.width=500,height=500; 
		// this.lines_hist = [];
		// this.thickness = 3;
		// this.fgcolor = "#808080";
		// this.bgcolor = "white";
		// var pointer = 0;
		// var stack = [];
		// var undo_max_buffer_size = 5;
		// var scale = 1;

	}
	
	updateSettings(setting,value){
		if(this.settings[setting] ){
			this.settings[setting] = value;
		}else{
			throw new Error(`UpdateSettingsError: '${setting}' not found!`);
		}
	}

	updateData(data_key,value){
		if(this.__data[data_key] ){
			this.__data[data_key] = value;
		}else{
			throw new Error(`UpdateDataError: '${data_key}' not found!`);
		}
	}

	getData(data_key){
		if(this.__data.hasOwnProperty(data_key)){
			return this.__data[data_key];
		}else{
			throw new Error(`GetDataError: '${data_key}' not found!`);
		}
	}

	getSettings(setting){

		if(this.settings.hasOwnProperty(setting)){
			return this.settings[setting];
		}else{
			throw new Error(`GetSettingsError: '${setting}' not found!`);
		}
	}

	onLoad(){
		this.canvas.width = this.getSettings('width');
		this.canvas.height = this.getSettings('height');
		this.ctx.lineCap = "round";
		
		this.canvas.onmouseup = function(e){
			this.updateData('mouseclicked', false);
			this.canvas.style.cursor = "default";
		}
		var cur = this;
		this.canvas.onmousedown = function(e){cur.onmousedown(e,cur)};

		this.canvas.onmousemove = function(e){cur.onmousemove(e,cur)};

		this.canvas.onmouseleave = function(e){
			//mouseclicked=false;
		}
		var cur = this; 
		requestAnimationFrame(function(){cur.draw(this)});
	}

	onmousemove(e,obj){
		console.log(obj);
		if(obj.getData("mouseclicked")){
			let lines_hist = obj.getData("lines_hist");
			let rect = obj.canvas.getBoundingClientRect();
			let x = e.clientX - rect.left;
			let y = e.clientY - rect.top;

			lines_hist[lines_hist.length-1].push({x:x,y:y});
			obj.updateData("lines_hist",lines_hist);
		}
	}
	onmousedown(e,obj){

		obj.updateData('mouseclicked', true);

		let lines_hist = obj.getData("lines_hist");
		let rect = obj.canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		let start = [{x:x,y:y}]

		start.color = obj.getSettings("fgcolor");
		start.width = obj.getSettings("thickness");

		lines_hist.push(start);
		
		canvas.style.cursor = "crosshair";
		obj.updateData("lines_hist",lines_hist);

	}

	fillbackground(color ){	
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0,0,this.getSettings("width"),this.getSettings("height"));
	}

	draw(obj){

		obj.fillbackground(this.getSettings("bgcolor"));
		let ctx = obj.ctx;
		lines_hist = obj.getSettings("lines_hist");

		for(var j=0;j<lines_hist.length;j++){
			ctx.beginPath();

			ctx.lineWidth = lines_hist[j].width;
			ctx.strokeStyle = lines_hist[j].color;

			ctx.moveTo(lines_hist[j][0].x,lines_hist[j][0].y);

			for(var i=1;i<lines_hist[j].length;i++){
				let p = lines_hist[j][i];
				ctx.lineTo(p.x,p.y);
			}
			ctx.stroke();
			ctx.closePath();
		}
		
		requestAnimationFrame(obj.draw);
	}

	apply(value,attr){
		switch(attr){
			case "width":
				this.canvas.width = value
				this.updateSettings('width',value);
				break;
			case "height":
				this.canvas.height = value;
				this.updateSettings('height',value);
				break;
		}
	}

	undo(){
		let lines_hist = this.getData("lines_hist");
		let stack = this.getData("stack");

		if(lines_hist.length == 0)return;
		if(stack.length == undo_max_buffer_size)return;
		stack.push(lines_hist.pop());
	}

	redo(){
		let lines_hist = this.getData("lines_hist");
		let stack = this.getData("stack");
		
		if(stack.length == 0)return;
		lines_hist.push(stack.pop());
	}

	clear_board(){
		let lines_hist = this.getData("lines_hist");

		lines_hist = [];
	}

	save(){
		let width = this.getData("width");
		let height = this.getData("height");
		let lines_hist = this.getData("lines_hist");

		// filename preparation
		var filename = prompt("File Name please ? Image will be saved as \".png\" extension","paint");
		if(filename===null){
			alert("invalid file name");
			return;
		}
		filename += "  ["+(new Date().toLocaleString())+"].png";

		// draw present canvas 
		let t_ctx = document.createElement("canvas").getContext('2d');
		t_ctx.canvas.width= width;
		t_ctx.canvas.height= height;
		t_ctx.clearRect(0,0,width,height);
		for(var j=0;j<lines_hist.length;j++){

			t_ctx.beginPath();
			t_ctx.lineWidth = lines_hist[j].width;
			t_ctx.strokeStyle = lines_hist[j].color;
			t_ctx.moveTo(lines_hist[j][0].x,lines_hist[j][0].y);

			for(var i=1;i<lines_hist[j].length;i++){
				let p = lines_hist[j][i];
				t_ctx.lineTo(p.x,p.y);
			}

			t_ctx.stroke();
			t_ctx.closePath();
		}

		// get canvas data as image
		var imageurl = t_ctx.canvas.toDataURL();

		// create a href link
		let a= document.createElement("a");
		a.href = imageurl;
		a.download=filename;a.target="_blank"
		a.rel="noopener"

		// click on virtual link
		try {
			a.dispatchEvent(new MouseEvent('click'))
		} catch (e) {
			var evt = document.createEvent('MouseEvents')
			evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
								  20, false, false, false, false, 0, null)
			a.dispatchEvent(evt)
		}
	}
}




window.onload = function(){
	window.__canvas = new DrawBoard()
	window.__canvas.onLoad();
}