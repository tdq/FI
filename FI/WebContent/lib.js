function compile(programm, ofset, maxPos, registers) {
  var commands = [];
  var labels = {};

  if(programm == null)
    return [];

  var lines = programm.split("\n");
  var pos = ofset;

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
        case "mov": commands.push({cmd: 1, args: [parts[1], parts[2]]}); pos += 3; break;
        case "add": commands.push({cmd: 2, args: [parts[1]]}); pos += 2; break;
        case "mul": commands.push({cmd: 3, args: [parts[1]]}); pos += 2; break;
        case "sub": commands.push({cmd: 4, args: [parts[1]]}); pos += 2; break;
        case "div": commands.push({cmd: 5, args: [parts[1]]}); pos += 2; break;
        case "not": commands.push({cmd: 6, args: []}); pos++; break;
        case "nop": commands.push({cmd: 7, args: []}); pos++; break;
        case "jmp": commands.push({cmd: 8, args: [parts[1]]}); pos += 2; break;
        case "teq": commands.push({cmd: 9, args: [parts[1]]}); pos += 2; break;
        case "tgt": commands.push({cmd: 10, args: [parts[1]]}); pos += 2; break;
        case "tlt": commands.push({cmd: 11, args: [parts[1]]}); pos += 2; break;
        case "ret": commands.push({cmd: 0, args: []}); pos++; break;
        default: throw new Error("Unknown command: "+command+" line "+i);
      }
    }
  }

  return writeMemory(commands, registers, labels, ofset, maxPos);
}

function writeMemory(commands, registers, labels, ofset, maxPos) {
  var programPos = ofset;
  var dataPos = maxPos;
  var memory = [];
  var variables = {};

  for(var i=0; i<commands.length; ++i) {
    var command = commands[i];
    var args = command.args;

    memory[programPos++] = command.cmd;
    for(var j=0; j<args.length; ++j) {
      var addr = 0;

      if(args[j] in labels) {
    	  addr = labels[args[j]];
      } else if(args[j] in registers) {
    	  addr = registers[args[j]];
      } else if(args[j] in variables) {
    	  addr = variables[args[j]];
      } else if(isNumber(args[j])) {
    	  memory[dataPos] = parseInt(args[j]);
    	  addr = dataPos--;
    	  variables[args[j]] = addr;
      } else if(args[j].match(/\[\d+\]/)) {
    	  addr = parseInt(args[j].substring(1, args[j].length-1));
      } else {
    	  throw new Error("Unknown argument: "+args[j]);
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