var audio = document.createElement("AUDIO");
var popup = {
	doc : document.querySelector("#popup"),
	hide: function(){
		this.doc.classList.remove("show");
		this.doc.classList.add("hide");
	},

	show: function() {
		this.doc.classList.remove("hide");
		this.doc.classList.add("show");
	}
}
audio.autoplay = true;
audio.preload = "auto";
document.body.appendChild(audio);
audio.src = "play.mp3"
var interval;

function getURLparams() {
	var add = window.location.href;
	var l = add.split('?');
	if (l[1] == undefined)
		return {};
	var noof = l[1].split('&');
	var params = {};
	for (var i = 0; i < noof.length; i++) {
		if (noof[i] == "")
			continue;
		let key = noof[i].split('=')[0];
		let value = noof[i].split('=')[1];
		params[key] = value;
	}
	return params;
}

function start(m, s) {
	var time = document.getElementById("show");
	function run() {
		time.innerText = m + ":" + s;
		if (s == 0) {
			if (m == 0 && s == 0) {
				audio.play();
				
				clearInterval(interval);
			}
			m--;
			s = 60;
		}
		s = (s - 1) % 60;
	}
	
	document.querySelector("#popup #confirm").addEventListener("click", ()=>{
		popup.hide()
		interval = (interval)?interval:setInterval(run, 1000);
	})
}

let params = getURLparams();

function getStartTime(m,s){

	if(m === undefined) m = 0;
	if(s === undefined) s = 0;
 
	let pM = Number.parseInt(m);
	let pS = Number.parseInt(s);

	if(pM == 0 && pS == 0) return [1, 0];

	pM += Number.parseInt(pS/60)
	pS = pS%60;

	return [pM,pS];
}

start(...getStartTime(params.m, params.s))
