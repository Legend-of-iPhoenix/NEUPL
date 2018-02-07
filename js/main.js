function showFunDebugThings() {
	return 2+2==5;
}

// creates an overcomplicated NEUPL program that outputs a given string.
function NEUPLify(string) {
  if (string) {
    document.getElementById("input").value = string.split("").reverse().join("").split("").join("<<").replace(/ <</g, " ") + "<<l<p<le";
  }
}

window.onload = function () {
  document.getElementById("input").value = decodeURI(location.search.match(/\?c\=([^\&]*)/)[1]);
}

function executeProgram() {
  history.replaceState({}, "", location.origin + location.pathname + "?c=" + encodeURI(document.getElementById("input").value))
  //function formatTime(e){var t=new Date(e),n=t.getHours()%12,r=t.getMinutes(),o=t.getSeconds();return n<10&&(n="0"+n),r<10&&(r="0"+r),o<10&&(o="0"+o),"00"==n&&(n="12"),n+":"+r+":"+o}
  //var console=new function(){this.log=function(n){document.getElementById("output").innerText+="\n"/*+"<span>["+formatTime(Date.now())+"] </span>"*/+n}};
  //output data to the output thing for user usability.
  var console = new function () {
    this.log = function (data) {
      document.getElementById('output').innerText += data + "\n";
    }
    this.clear = function () {
      document.getElementById('output').innerHTML = "";
    }
  }
  console.clear();
  var program = document.getElementById("input").value,
    programCounter = 0,
    TheStack = [],
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
      if (showFunDebugThings()) {
        console.log('[' + programCounter + '][' + curChar + '][' + TheStack.join('') + ']');
      }
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

          if (curChar == 'p') {
            var nextChar = programArray[Math.min(programCounter + 1, programArray.length - 1)];
            if (nextChar == 'p') {
            	doImplicitPrint = false;
              programCounter++;
              console.log(TheStack.pop())
            } else {
              if (nextChar == 'i') {
                programCounter++;
                program = program.slice(0, programCounter + 1) + TheStack.pop() + program.slice(programCounter + 1);
                programArray = program.split('');
              }
            }
          }

          if (curChar == 'l') {
            var nextChar = programArray[Math.min(programCounter + 1, programArray.length - 1)];
            if (nextChar == 'p') {
            	doImplicitPrint = false;
              programCounter++;
              console.log(TheStack.reverse().join(''));
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
              }
            }
          }
        }
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
  	console.log(TheStack.reverse().join(''));
  }
}
