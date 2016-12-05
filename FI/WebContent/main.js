function mc100() {
  this.memory = [];
  this.pos = 3;
  this.memOffset = 3;
  this.maxPos = 63;
  this.accAddr = 0;
  this.p0Addr = 1;
  this.p1Addr = 2;
  this.reset();
}

mc100.prototype.launch = function() {
  this.reset();

  while(this.step()) {}
};

mc100.prototype.step = function() {
  var cmd = this.memory[this.pos++];

  switch(cmd) {
    case 1:
      addr1 = this.memory[this.pos++];
      addr2 = this.memory[this.pos++];
      this.memory[addr2] = this.memory[addr1];
      break;
    case 2:
      addr1 = this.memory[this.pos++];
      this.memory[this.accAddr] += this.memory[addr1];
      break;
    case 3: break;
    case 4: break;
    case 5: break;
    case 6: break;
    case 7: break;
    case 8: break;
    case 9: break;
    case 10: break;
    case 11: break;
    case 0: return false; break;
    default: throw new Error("Unknown command: "+cmd+" at "+this.pos);
  }

  console.log(this.memory);

  return true;
};

mc100.prototype.reset = function() {
  this.pos = 3;
  this.state = null;
}

mc100.prototype.setProgram = function(program) {
  this.memory = compile(program, this.memOffset, this.maxPos);
}

mc = new mc100();

function setCommands(elem) {
  mc.setProgram(elem.value);
}

function launch() {
  //mc.setCommands(document.querySelector("mc100 textarea").value);
  mc.launch();
}

function step() {
  mc.step();
}

function reset() {
  mc.reset();
}

function compile(programm, ofset, maxPos) {
  var commands = [];
  var labels = {"acc": 0, "p0": 1, "p1": 2};

  if(programm == null)
    return [];

  var lines = programm.split("\n");
  var pos = 0;

  for(var i=0; i<lines.length; ++i) {
    var line = lines[i].trim();

    // Skip comments
    if(line.startsWith("#") || line.length == 0)
      continue;

    var parts = line.split(/\s+/);

    // Determine command or label
    if(parts.length == 1 && parts[0].trim().endsWith(":")) {
      // It is label
      labels[parts[0].substring(0, parts[0].length-1)] = pos;
    } else if(parts.length > 0) {
      var command = parts[0];
      switch(command) {
        case "mov": commands.push({cmd: 1, args: [parts[1], parts[2]]}); break;
        case "add": commands.push({cmd: 2, args: [parts[1]]}); break;
        case "mul": commands.push({cmd: 3, args: [parts[1]]}); break;
        case "sub": commands.push({cmd: 4, args: [parts[1]]}); break;
        case "div": commands.push({cmd: 5, args: [parts[1]]}); break;
        case "not": commands.push({cmd: 6, args: []}); break;
        case "nop": commands.push({cmd: 7, args: []}); break;
        case "jmp": commands.push({cmd: 8, args: [parts[1]]}); break;
        case "teq": commands.push({cmd: 9, args: [parts[1], parts[2]]}); break;
        case "tgt": commands.push({cmd: 10, args: [parts[1], parts[2]]}); break;
        case "tlt": commands.push({cmd: 11, args: [parts[1], parts[2]]}); break;
        case "ret": commands.push({cmd: 0, args: []}); break;
        default: throw new Error("Unknown command: "+command+" line "+i);
      }
    }
  }

  return writeMemory(commands, labels, ofset, maxPos);
}

function writeMemory(commands, labels, ofset, maxPos) {
  var programPos = ofset;
  var dataPos = maxPos;
  var memory = [];

  for(var i=0; i<commands.length; ++i) {
    var command = commands[i];
    var args = command.args;

    memory[programPos++] = command.cmd;
    for(var j=0; j<args.length; ++j) {
      var addr = 0;

      if(args[j] in labels) {
        addr = labels[args[j]];
      } else if(isNumber(args[j])) {
        memory[dataPos] = parseInt(args[j]);
        addr = dataPos--;
        labels[args[j]] = addr;
      }

      memory[programPos++] = addr;
    }

    if(programPos >= dataPos-1)
      throw new Error("Out of memory");
  }

  memory[programPos] = 0;

  return memory;
}

function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}
