

mc = new mc100();

mc.onValueChange(listenPort);

function setCommands(elem) {
  mc.setProgram(elem.value);
}

function launch() {
	setPortValue('p0', "p0");
	setPortValue('p1', "p1");
	mc.launch();
}

function step() {
  mc.step();
}

function reset() {
  mc.reset();
}

function listenPort(port, value) {
	var input = document.querySelector("#"+port);
	input.value = value;
}

function setPortValue(port, elem) {
	mc.setPortValue(port, document.querySelector("#"+elem).value);
}
