function mc100() {
  this.memory = [];
  this.pos = 3;
  this.memOffset = 3;
  this.maxPos = 63;
  this.accAddr = 0;
  this.p0Addr = 1;
  this.p1Addr = 2;
  this.registers = {"acc": this.accAddr, "p0": this.p0Addr, "p1": this.p1Addr};
  this.reset();
}

mc100.prototype.launch = function() {
  this.reset();

  while(this.step()) {}
};

mc100.prototype.step = function() {
	console.log(this.memory);
	
	if(this.state == 0)
		return false;
	
  var cmd = this.getValue(this.pos++);

  switch(cmd) {
  	// mov
    case 1:
    	addr1 = this.getValue(this.pos++);
    	addr2 = this.getValue(this.pos++);
    	this.setValue(addr2, this.getValue(addr1));
    	break;
    // add
    case 2:
    	addr1 = this.getValue(this.pos++);
    	this.setValue(this.accAddr, this.getValue(this.accAddr) + this.getValue(addr1));
    	break;
    // mul
    case 3: 
    	addr1 = this.getValue(this.pos++);
        this.setValue(this.accAddr, this.getValue(this.accAddr) * this.getValue(addr1));
    	break;
    // sub
    case 4: 
    	addr1 = this.getValue(this.pos++);
        this.setValue(this.accAddr, this.getValue(this.accAddr) - this.getValue(addr1));
    	break;
    // div
    case 5: 
    	addr1 = this.getValue(this.pos++);
        this.setValue(this.accAddr, this.getValue(this.accAddr) / this.getValue(addr1));
    	break;
    // not
    case 6: 
        this.setValue(this.accAddr, this.getValue(this.accAddr) != 0 ? 100: 0);
        break;
    // nop
    case 7: break;
    // jmp
    case 8: 
    	this.pos = this.getValue(this.pos++);
    	break;
    // teq
    case 9: 
    	addr1 = this.getValue(this.pos++);
    	if(this.getValue(this.accAddr) == this.getValue(addr1))
    		this.pos = this.getAddr(this.pos);
    	else
    		this.pos = this.getAddr(this.pos+1);
    		
    	break;
    // tgt
    case 10: 
    	addr1 = this.getValue(this.pos++);
    	if(this.getValue(this.accAddr) < this.getValue(addr1))
    		this.pos = this.getAddr(this.pos);
    	else
    		this.pos = this.getAddr(this.pos+1);
    	
    	break;
    // tlt
    case 11: 
    	addr1 = this.getValue(this.pos++);
    	if(this.getValue(this.accAddr) > this.getValue(addr1))
    		this.pos = this.getAddr(this.pos);
    	else
    		this.pos = this.getAddr(this.pos+1);
    	
    	break;
    // ret
    case 0: 
    	this.state = 0;
    	return false; 
    	break;
    default: throw new Error("Unknown command: "+cmd+" at "+this.pos);
  }

  return true;
};

mc100.prototype.getAddr = function(addr) {
	if(addr < 0 || addr > this.maxPos) {
		throw new Error("Undefined addres: "+addr);
	}
	
	return addr;
}

mc100.prototype.getValue = function(addr) {
	return this.memory[this.getAddr(addr)];
}

mc100.prototype.setValue = function(addr, val) {
	if(!isNumber(val))
		throw new Error("Wrong value (only integers accepted): "+val);
	
	this.memory[this.getAddr(addr)] = parseInt(val);
	var self = this;
	
	if(this.hasOwnProperty("valueChangeListener")) {
		var port = null;
		
		switch(addr) {
		case self.p0Addr: port = "p0"; break;
		case self.p1Addr: port = "p1"; break;
		};
		
		if(port != null)
			this.valueChangeListener(port, parseInt(val));
	}
}

mc100.prototype.reset = function() {
  this.pos = 3;
  this.setValue(this.accAddr, 0);
  this.state = null;
}

mc100.prototype.setProgram = function(program) {
  this.memory = compile(program, this.memOffset, this.maxPos, this.registers);
}

mc100.prototype.setPortValue = function(port, value) {
	if(port in this.registers) {
		this.setValue(this.registers[port], value);
	} else {
		throw new Error("Unknown port: "+port);
	}
}

mc100.prototype.getPortValue = function(port) {
	if(port in this.registers) {
		return this.getValue(this.registers[port]);
	} else {
		throw new Error("Unknown port: "+port);
	}
}

mc100.prototype.onValueChange = function(listener) {
	this.valueChangeListener = listener;
}