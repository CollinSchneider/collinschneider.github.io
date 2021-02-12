window.addEventListener('load', function() {
  var consoleEl = document.querySelector('#console')
  consoleEl.addEventListener('click', function() {
    document.querySelector('#hidden-input').focus();
  })
  consoleEl.click();
  var consoleHandler = new ConsoleHandler(consoleEl);
  consoleHandler.start();
});

function ConsoleHandler(consoleElement, options) {
  var _ = this;
  var options = options || {};
  _.console = consoleElement,
    _.currentLineEl = _.console.querySelector('.line.current'),
    currentLineUserInputEl = _.currentLineEl.querySelector('.user-input'),
    _.currentUserInput = '',
    _.cursor = _.currentLineEl.querySelector('#cursor'),
    _.hiddenMobileInput = document.querySelector('#hidden-input-container'),
    _.characterElementsInputted = [],
    _.currentCursorIndex = _.characterElementsInputted.length-1;
    // _.directories = {
    //   'home': {
    //     'collin': {
    //       'files': ['resume.pdf']
    //     }
    //   }
    // }

  _.start = function() {
    var keyHandler = new KeyHandler(_);
    keyHandler.initialize();
    window.addEventListener('keydown', keyHandler.handleKeydown);
    window.addEventListener('keydown', keyHandler.checkHotKeys);
    window.addEventListener('keyup', keyHandler.resetHotKeys);
  }

  _.setInputText = function(text) {
    _._clearCurrentLine();
    text.split('').forEach(function(char) {
      _.addCharacterToUserInput(char);
    })
  }

  _.addCharacterToUserInput = function(character) {
    var charEl = document.createElement('span');
    charEl.className = 'character';
    charEl.innerText = character;
    currentLineUserInputEl.insertBefore(charEl, _.characterElementsInputted[_.currentCursorIndex+1]);
    _.characterElementsInputted.splice(_.currentCursorIndex+1, 0, charEl);
    _.currentUserInput = _.characterElementsInputted.map(function(el) { return el.innerText }).join('');
    _._moveCursorToPosition(_.currentCursorIndex+1);
  }

  _.removeCharacterInFocus = function() {
    var element = _.characterElementsInputted[_.currentCursorIndex];
    if(element) {
      element.remove();
      _.characterElementsInputted.splice(_.currentCursorIndex, 1);
      _.currentUserInput = _.characterElementsInputted.map(function(el) { return el.innerText }).join('');
      _.currentCursorIndex -= 1;
    }
  }

  _.clearConsole = function(clearUserInput) {
    _.console.innerHTML = '';
    var userInputBeforeClear = _.currentUserInput;
    _.newLine();
    if(!clearUserInput) {
      _.setInputText(userInputBeforeClear);
    }
  }

  _.tryMovingCursorForward = function() {
    _._moveCursorToPosition(_.currentCursorIndex+1)
  }

  _.tryMovingCursorBack = function() {
    _._moveCursorToPosition(_.currentCursorIndex-1)
  }

  _.addResultsLine = function(message) {
    var results = document.createElement('div');
    results.className = 'results';
    results.innerText = message;
    _.currentLineEl.append(results);
  }
  
  _.newLine = function() {
    var newLine = document.createElement('div');
    newLine.className = 'line text';
    
    var directory = document.createElement('div');
    directory.className = 'directory';
    directory.innerText = 'CollinOS:/home/collin$'
    newLine.append(directory);
    
    var input = document.createElement('div');
    input.className = 'user-input';
    newLine.append(input);
    
    _.currentLineEl = newLine;
    currentLineUserInputEl = input;
    _.currentUserInput = '';

    input.appendChild(_.cursor);
    _.console.append(newLine);
    _.characterElementsInputted = [];
    _.currentCursorIndex = -1;
    _._moveHiddenInputToFocusedLine(newLine)
  }

  _._clearCurrentLine = function() {
    _.characterElementsInputted.forEach(function(el) { el.remove() });
    _.characterElementsInputted = [];
    _.currentCursorIndex = -1;
  }

  _._moveCursorToPosition = function(index) {
    var begginingOfUserInputIndex = -1;
    var endOfUserInputIndex = _.characterElementsInputted.length-1;
    if(index >= begginingOfUserInputIndex && index <= endOfUserInputIndex) {
      var nextCharacter = _.characterElementsInputted[index+1];
      _.currentCursorIndex = index;
      if(nextCharacter) {
        currentLineUserInputEl.insertBefore(_.cursor, nextCharacter)
      } else {
        currentLineUserInputEl.append(_.cursor);
      }
    }
  }

  _._moveHiddenInputToFocusedLine = function(newLine) {
    var rect = newLine.getBoundingClientRect();
    _.hiddenMobileInput.style.top = rect.top + 'px';
  }
}

////////////////
// KeyHandler //
////////////////
// handles all key presses
function KeyHandler(consoleHandler) {
  var _ = this;
  _.consoleHandler = consoleHandler,
    _.controlKeyIsPressed = false,
    _.commandKeyIsPressed = false;

  _.initialize = function() {
    _.commandHistory = new CommandHistory;
    _.methodHandler = new MethodHandler(_.consoleHandler, _.commandHistory);
    _.methodHandler.initialize();
    _.noResponseKeyCodes = [8, 9, 13, 20, 16, 17, 18, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124];
    _.keyCodeFunctionDictionary = {
      8: _._onBackspace,
      13: _._onEnter,
      38: _._onUpKey,
      40: _._onDownKey,
      37: _._onLeftKey,
      39: _._onRightKey
    }
  }

  _.handleKeydown = function(event) {
    var reservedKeyCodeMethod = _.keyCodeFunctionDictionary[event.keyCode];
    if(reservedKeyCodeMethod) {
      reservedKeyCodeMethod(event);
    }
    if(!_.controlKeyIsPressed && !_.commandKeyIsPressed && _.noResponseKeyCodes.indexOf(event.keyCode) === -1) {
      _.consoleHandler.addCharacterToUserInput(event.key);
    }
  }

  _.checkHotKeys = function(event) {
    switch(event.keyCode) {
      case 17:
        _.controlKeyIsPressed = true;
        break;
      case 91:
        _.commandKeyIsPressed = true;
        break;
      case 93:
        _.commandKeyIsPressed = true;
        break;
      case 75:
        if(_.commandKeyIsPressed) _.consoleHandler.clearConsole();
        break;
      case 67:
        if(_.controlKeyIsPressed) _.consoleHandler.newLine();
        break;
      default:
        // not a hot key
        break;
    }
  };

  _.resetHotKeys = function(event) {
    if(event.keyCode === 17) {
      _.controlKeyIsPressed = false;
    } else if(event.keyCode === 91 || event.keyCode === 93) {
      _.commandKeyIsPressed = false;
    }
  }

  _._onBackspace = function() {
    _.consoleHandler.removeCharacterInFocus();
  }

  _._onUpKey = function() {
    var previousCommand = _.commandHistory.tryRotateToPreviousCommand();
    if(previousCommand) {
      _.consoleHandler._clearCurrentLine();
      setTimeout(function() {
        _.consoleHandler.setInputText(previousCommand)
      }, 50)
    }
  }

  _._onDownKey = function() {
    var nextCommand = _.commandHistory.tryRotateToNextCommand();
    if(nextCommand) {
      _.consoleHandler._clearCurrentLine();
      setTimeout(function() {
        _.consoleHandler.setInputText(nextCommand);
      }, 50)
    } else {
      _.consoleHandler.setInputText('');
    }
  }

  _._onLeftKey = function() {
    _.consoleHandler.tryMovingCursorBack();
  }

  _._onRightKey = function() {
    _.consoleHandler.tryMovingCursorForward();
  }

  _._onEnter = function() {
    _.methodHandler.handleMethod(_.consoleHandler.currentUserInput)
  }
}

////////////////////////
// DirectoryNavigator //
////////////////////////
function DirectoryNavigator() {
  
}

///////////////////
// MethodHandler //
///////////////////
// handles all inputted methods after the user hits enter
function MethodHandler(consoleHandler, commandHistory) {
  var _ = this;
  _.consoleHandler = consoleHandler;
  _.commandHistory = commandHistory;

  _.initialize = function() {
    _._logHelp();
    _.commandDictionary = {
      '': {
        function: _.consoleHandler.newLine
      },
      'help': {
        function: _._logHelp,
        help: 'Run `help` at any time to see this list of available methods\n\
                Run `help name` to find out more about the method `name`'
      },
      'clear': {
        function: _._clearConsole,
        help: 'Use `clear` to flush the console clean.'
      },
      'gui': {
        function: _._displayGui,
        help: 'Use `gui` to switch from the CLI view to the GUI.'
      },
      'curl': {
        function: _._curl,
        help: 'Use `curl` to make a curl request to the (mandatory) URL endpoint provided.\n\n\
Optional arguments:\n\
--method or --X to specify the request method (GET, POST)\n\
--data or -d to provide a JSON payload in your POST request (NO spaces)\n\n\
Example:\n\
curl https://www.google.com/foo --method=POST --data={"bar":"baz","hello":"world"}\n\n'
      },
      'about': {
        function: _._logAbout,
        help: 'Use `about` to learn more about collin.'
      },
      'resume': {
        function: _._presentResume,
        help: 'Use `resume` to take a peak at collin\'s resume.\n\
                Accepts the --format argument of `browser` or `download`. Default is `browser`.'
      },
      'email': {
        function: _._email,
        help: 'Use `email` to return collin\'s email.\n\
                Accepts the --method argument of `print` to print collin\'s email to STDOUT or `program` to compose an email in your default mail program. Default is `print`.'
      },
      'pwd':{
        function:  _._pwd,
        help: 'Use `pwd` to print current location'
      },
      'ls': {
        function: _._ls,
        help: 'Use `ls` to list other files and directories.'
      },
      // 'cd': _._cd,
      'linkedin': {
        function: _._linkedin,
        help: 'Use `linkedin` to open collin\'s LinkedIn page in a new tab in your browser.'
      }
    }
  }

  _.handleMethod = function(inputtedCommand) {
    var trimmedCommand = inputtedCommand.trim();
    var splitCommand = trimmedCommand.split(/\s(.+)/)
    var commandToRun = _.commandDictionary[splitCommand[0]];
    var args = splitCommand[1];
    if(trimmedCommand !== "") {
      _.commandHistory.addCommandToHistory(trimmedCommand);
    }
    if(commandToRun) {
      commandToRun.function(args);
    } else {
      _._invalidCommand(trimmedCommand);
    }
  }

  _._invalidCommand = function(command) {
    _._logResult('command not found: '+command);
  }

  _._invalidArgument = function(argParam, argGiven, allowedArgs) {
    _._logResult('Invalid arguments provided for '+argParam+': '+argGiven+'. Available arguments are: '+allowedArgs.join(', ')+'.');
  }

  _._getArgumentsWithoutParameter = function(argumentString) {
    if(argumentString) {
      return argumentString.split(' ').filter(function(arg) { return arg.indexOf('=') === -1 });
    }
  }

  _._getArgument = function(argumentString, arg) {
    if(argumentString) {
      var split = argumentString.split(arg+'=')[1];
      if(split) {
        return split.split(/\s|&/)[0];
      }
    }
  }

  _._clearConsole = function() {
    _.consoleHandler.clearConsole(true);
  }

  _._logHelp = function(optionalMethod) {
    if(optionalMethod) {
      if(_.commandDictionary[optionalMethod]) {
        _._logResult(_.commandDictionary[optionalMethod].help)
      } else {
        _.invalidMethod(optionalMethod)
      }
    } else {
      _._logResult('Welcome to CollinOS!\n\
                      Run `help` at any time to see this list of available methods\n\
                      Run `help name` to find out more about the method `name`\n\n\
                      Basic Usage:\n\
                      If you\'d rather view the site from a GUI, use the `gui` command\n\
                      Use the up and down arrows to rotate through your command history.\n\
                      Control + C starts a new line\n\
                      Command + K flushes the console\n\n\
                      Available commands:\n\
                      curl [url]................................................curl endpoints\n\
                      ls............................................................list content of directory\n\
                      pwd........................................................print current working directory\n\
                      gui.........................................................switch to the GUI version of www.collinschneider.com\n\
                      clear......................................................flushes this console (equivalent of Command + k)\n\
                      email --method=[print|program]...........write an email to collin\n\
                      resume --format=[browser|download]...view collin\'s resume\n\
                      about....................................................learn more about collin\n\
                      linkedin.................................................view collin\'s linkedin\n\n');
    }
  }

  _._curl = function(commandArguments) {
    var xhr = new XMLHttpRequest();
    var url = _._getArgumentsWithoutParameter(commandArguments);
    xhr.addEventListener("load", function(resp) { 
      _._logResult(resp.currentTarget.responseText);

    });
    if(!url || url.length === 0) {
      _._logResult('No URL specified in the `curl` command. Run `curl help` for more information on the CollinOS `curl` command.')
    } else if(url.length > 1) {
      _._logResult('Multiple un-named arguments passed to the `curl` command. Only one un-named argument is allowed in order to specify the `url` option.');
    } else {
      var method = _._getArgument(commandArguments, 'X') || _._getArgument(commandArguments, 'method') || 'GET';
      var data = _._getArgument(commandArguments, 'data') || _._getArgument(commandArguments, 'd');
      var corsProxyUrl = 'https://proxy-server-collin.herokuapp.com/proxy'
      var xhrUrl = corsProxyUrl + '?url=' + url[0] + '&method=' + method + '&data='+data;
      xhr.open('GET', xhrUrl)
      xhr.send();
    }
  }

  _._displayGui = function() {
    window.location.pathname = '/gui';
  }

  _._logAbout = function() {
    _._logResult('Programmer, basketball junkie, negroni enjoyer.')
  }

  _._email = function(methodArguments) {
    var method = _._getArgument(methodArguments, 'method') || 'print';
    if(method === 'print') {
      _._logResult('collin\'s email: collinschneider3@gmail.com');
    } else if(method === 'program') {
      window.location.href = 'mailto:collinschneider3@gmail.com';
      _.consoleHandler.newLine();
    } else {
      _._invalidArgument('method', method, ['print', 'program']);
    }
  }

  _._pwd = function() {
    _._logResult('/home/collin');
  }

  _._ls = function() {
    _._logResult('resume.txt\nabout.txt');
  }

  _._linkedin = function() {
    window.open('https://www.linkedin.com/in/collinschneider');
    _.consoleHandler.newLine();
  }

  _._logResult = function(msg, options) {
    options = options || {};
    _.consoleHandler.addResultsLine(msg)
    if(!options.disableNewLine) {
      _.consoleHandler.newLine();
    }
  }
}

////////////////////
// CommandHistory //
////////////////////
// Stores and returns the history of commands the user has entered
function CommandHistory() {
  var _ = this;
  _.commandHistory = JSON.parse(localStorage.getItem('collinOSCommandHistory') || '[]'),
  _.currentCommandHistoryIndex = _.commandHistory.length;
  
  _.addCommandToHistory = function(command) {
    _.commandHistory.push(command);
    localStorage.setItem('collinOSCommandHistory', JSON.stringify(_.commandHistory));
    _.currentCommandHistoryIndex = _.commandHistory.length;
  }

  _.tryRotateToPreviousCommand = function() {
    var previousCommandIndex = _.currentCommandHistoryIndex-1;
    var previousCommand = _.commandHistory[previousCommandIndex];
    if(previousCommand) {
      _.currentCommandHistoryIndex = previousCommandIndex;
      return previousCommand;
    }
  }

  _.tryRotateToNextCommand = function() {
    var nextCommandIndex = _.currentCommandHistoryIndex+1;
    var nextCommand = _.commandHistory[_.currentCommandHistoryIndex+1];
    if(nextCommand) {
      _.currentCommandHistoryIndex = nextCommandIndex;
      return nextCommand
    } else {
      _.currentCommandHistoryIndex = _.commandHistory.length;
    }
  }
}