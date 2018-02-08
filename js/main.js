var showFunDebugThings = false;

window.onload = function () {
  document.getElementById("input").value = decodeURI(location.search.match(/\?c\=([^\&]*)/)[1]);
  document.getElementById("programInput").value = decodeURI(location.search.match(/\?c\=([^\&]*)&i=(.*)/)[2]);
  tgif = Date().toLocaleString().startsWith("F");
  console.log("   _   _ ______ _    _ _____  _        \n  | \\ | |  ____| |  | |  __ \\| |       \n  |  \\| | |__  | |  | | |__) | |       \n  | . ` |  __| | |  | |  ___/| |       \n  | |\\  | |____| |__| | |    | |____   \n  |_| \\_|______|\\____/|_|    |______|  \n                                       \n=======================================\n        Welcome to the console!        \n                                       \n    If you are a developer and want    \n    to contribute code and improve     \n    NEUPL, you can visit our GitHub    \n    repo, which is linked below.       \n                                       \n    If you are just poking around, we  \n    recommend checking out /js/main.js \n    first. It contains the function    \n    executeProgram() which interprets  \n    the NEUPL code entered by users.   \n=======================================\nhttps://github.com/Legend-of-iPhoenix/NEUPL"+(tgif?"\n P.S. Happy Friday":""));
}

function executeProgram() {
  var output = document.getElementById('output');
  history.replaceState({}, "", location.origin + location.pathname + "?c=" + encodeURI(document.getElementById("input").value) + (document.getElementById("programInput").value ? "&i="+encodeURI(document.getElementById("programInput").value) : ""));
  output.innerHTML = "";
  var program = document.getElementById("input").value,
    programCounter = 0,
    TheStack = document.getElementById("programInput").value.split('').reverse(),
    programStack = ["a"],
    programCounterStack = [],
    programLevel = 0,
    programArray = program.split(''),
    initialExecution = true,
    inString = false,
    curChar = "",
    lastChar = "",
    doImplicitPrint = true;
  while ((programStack.length > 0) || (programCounter < (program.length - 1))) {
    if (initialExecution)
      programStack.pop();
    initialExecution = false;
    while (programCounter < programArray.length) {
      lastChar = curChar;
      curChar = programArray[programCounter].toLowerCase();
      if (programArray[Math.min(programCounter + 1, 0)] !== "<" || curChar == "<") {
        if (curChar == '"' && lastChar != '\\') {
          inString = !inString;
        } else {
          if (inString && !(programArray[Math.min(programCounter + 1, 0)] == '"' && curChar == '\\')) {
            TheStack.push(programArray[programCounter]);
          } else {
            if (curChar == '<') {
              TheStack.push(programArray[Math.max(programCounter - 1, 0)]);
            }

            if (curChar === ' ') {
              TheStack.push(' ');
            }

            if (curChar == 'r') {
              var nextChar = programArray[Math.min(programCounter + 1, programArray.length - 1)];
              if (nextChar == 's') {
                TheStack = TheStack.reverse();
              } else {
                /* disfunctional >_> if (nextChar == 'p') {
                  program = programArray.reverse().join('');
                  programArray = programArray.reverse();
                }*/
              }
            }
            if (curChar == 'c') {
            	TheStack = [];
            }

            if (curChar == 'i') {
            	var times = TheStack.pop();
            	if (parseInt(times).toString() === "NaN") {
            		TheStack.push(times);
            		times = 1;
            	} else {
            		times = parseInt(times);
            	}
            	TheStack.push(String.fromCharCode(TheStack.pop().charCodeAt(0)+times))
            }
            if (curChar == 'd') {
            	var times = TheStack.pop();
            	if (parseInt(times).toString() === "NaN") {
            		TheStack.push(times);
            		times = 1;
            	} else {
            		times = parseInt(times);
            	}
            	TheStack.push(String.fromCharCode(TheStack.pop().charCodeAt(0)-1))
            }
            if (curChar == '*') {
            	var times = TheStack.pop();
            	if (parseInt(times).toString() === "NaN") {
            		TheStack.push(times);
            		times = 2;
            	} else {
            		times = parseInt(times);
            	}
            	TheStack.push(TheStack.pop().repeat(times))
            }
            if (curChar == '=') {
            	TheStack.push(TheStack.pop() == TheStack.pop() ? 't' : 'f');
            }
            if (curChar == 'p') {
              var nextChar = programArray[Math.min(programCounter + 1, programArray.length - 1)];
              if (nextChar == 'p') {
                doImplicitPrint = false;
                programCounter++;
                output.innerText += TheStack.pop() + '\n';
              } else {
                if (nextChar == 'i') {
                  programCounter++;
                  program = program.slice(0, programCounter + 1) + TheStack.pop() + program.slice(programCounter + 1);
                  programArray = program.split('');
                } else {
                  if (nextChar == 'n')
                    TheStack.pop();
                  programCounter++;
                }
              }
            }
            if (curChar == 'l') {
              var nextChar = programArray[Math.min(programCounter + 1, programArray.length - 1)];
              if (nextChar == 'p') {
                doImplicitPrint = false;
                programCounter++;
                output.innerText += TheStack.reverse().join('') + '\n';
                TheStack = [];
              } else {
                if (nextChar == 'e') {
                  programCounterStack.push(programCounter + 1)
                  programStack.push(program);
                  programCounter = -1;
                  program = TheStack.join('');
                  programArray = TheStack;
                  programLevel++;
                  TheStack = [];
                } else {
                  if (nextChar == 'n') {
                    TheStack = [];
                  }
                }
              }
            }
          }
        }
      }
      if (showFunDebugThings) {
        output.innerText += '[' + programCounter + '][' + curChar + '][' + TheStack.join('') + ']\n';
      }
      programCounter++;
    }
    while ((programStack.length !== 0) && !(programCounter < programArray.length)) {
      if (programStack.length !== 0) {
        program = programStack.pop();
        programCounter = programCounterStack.pop();
        programArray = program.split('');
      }
    }
  }
  if (doImplicitPrint) {
    output.innerText += TheStack.reverse().join('') + '\n';
  }
}
var tgif = "";