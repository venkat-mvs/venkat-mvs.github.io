var canvas = document.getElementById("board");
var ctx = canvas.getContext('2d');

function apply(value,attr){
	if(attr=="width"){
		canvas.width = value
		width=value;
	}else if(attr=="height"){
		canvas.height = value
		height=value;
	}
}
function undo(){
	if(lines_hist.length == 0)return;
	if(stack.length == undo_max_buffer_size)return;
	stack.push(lines_hist.pop());
}
function redo(){
	if(stack.length == 0)return;
	lines_hist.push(stack.pop());
}
ctx.lineCap = "round";
function background(color="black"){	
	ctx.fillStyle = color;
	ctx.fillRect(0,0,width,height);
}
canvas.width = width;
canvas.height = height;
canvas.onmouseup = function(e){
	mouseclicked = false;
	canvas.style.cursor = "default";
}
canvas.onmousedown = function(e){
	mouseclicked = true;
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	let start = [{x:x,y:y}]
	start.color = fgcolor;
	start.width = thickness;
	lines_hist.push(start);
	canvas.style.cursor = "crosshair";
}
canvas.onmousemove = function(e){
	if(mouseclicked){
		let rect = canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		lines_hist[lines_hist.length-1].push({x:x,y:y});
	}
}
canvas.onmouseleave = function(e){
	//mouseclicked=false;
				 }
function clear_board(){
	lines_hist = [];
}
function save(){
	var filename = prompt("File Name please ? Image will be saved as \".png\" extension","paint");
	if(filename===null){
		return;
	}
	filename += "  ["+(new Date().toLocaleString())+"].png";
	let t_ctx = document.createElement("canvas").getContext('2d');
	t_ctx.canvas.width=width;
	t_ctx.canvas.height=height;
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
	var imageurl = t_ctx.canvas.toDataURL();
	let a= document.createElement("a");
	a.href = imageurl;
	a.download=filename;a.target="_blank"
	a.rel="noopener"
	try {
		a.dispatchEvent(new MouseEvent('click'))
	} catch (e) {
		var evt = document.createEvent('MouseEvents')
		evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
						      20, false, false, false, false, 0, null)
		a.dispatchEvent(evt)
	}
}
function draw(){
	background(bgcolor);
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
	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
