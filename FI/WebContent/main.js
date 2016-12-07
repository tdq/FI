mc1 = new mc100();
mc2 = new mc100();

mc1.onValueChange(listenPortMc1);
mc2.onValueChange(listenPortMc2);

function setCommands(mc, elem) {
  mc.setProgram(elem.value);
}

function launch() {
	mc1.launch();
}

function step() {
	setPortValue(mc1, 'p0', "p0");
	setPortValue(mc1, 'p1', "p1");
	setPortValue(mc2, 'p0', "p1");
	setPortValue(mc2, 'p1', "p2");
	mc1.step();
	mc2.step();
}

function reset() {
  mc1.reset();
  mc2.reset();
}

function listenPortMc1(port, value) {
	var id;
	switch(port) {
	case "p0": id="#p0"; break;
	case "p1": id="#p1"; break;
	}
	
	var input = document.querySelector(id);
	input.value = value;
}

function listenPortMc2(port, value) {
	var id;
	switch(port) {
	case "p0": id="#p1"; break;
	case "p1": id="#p2"; break;
	}
	
	var input = document.querySelector(id);
	input.value = value;
}

function setPortValue(mc, port, elem) {
	mc.setPortValue(port, document.querySelector("#"+elem).value);
}
