window.addEventListener('load', function() {
  var consoleEl = document.querySelector('#console')
  var consoleHandler = new ConsoleHandler(consoleEl);
  consoleHandler.start();
});

function ConsoleHandler(consoleElement, options) {
  var _ = this;
  var options = options || {};
  _.console = consoleElement,
    _.currentLine = _.console.querySelector('.line.current'),
    _.currentLineInput = _.currentLine.querySelector('.input'),
    _.currentUserInput = '',
    _.cursor = _.currentLine.querySelector('#cursor'),
    _.controlKeyIsPressed = false,
    _.commandKeyIsPressed = false,
    // Enter, Backspace, Commnand, Control, Left, Right, Up, Down
    _.noResponseKeyCodes = [9, 13, 20, 16, 17, 18, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124],
    _.commandHistory = JSON.parse(localStorage.getItem('collinOSCommandHistory') || '[]'),
    _.currentCommandHistoryIndex = _.commandHistory.length;
    _.directories = {
      'home': {
        'collin': {
          'files': ['resume.pdf']
        }
      }
    }

  _.start = function(currentDirectory) {
    window.addEventListener('keydown', _._handleKeydown);
    window.addEventListener('keydown', _._checkHotKeys);
    window.addEventListener('keyup', _._resetHotKeys);
    _.keyCodeFunctionDictionary = {
      8: _._removeLastCharacterFromCurrentLine,
      13: _._handleEnter,
      38: _._displayPreviousCommand,
      40: _._displayNextCommand
    }
    
    _.methodDictionary = {
      '': {
        function: _._newLine
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
                Accepts the --method argument of `print` or `program` to compose email in your default mail program. Default is `program`.'
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
        help: 'Use `linkedin` to open collin\'s LinkedIn page in a new tab.'
      }
    }
    _.currentDirectoryName = currentDirectory || '/home/collin',
    _._logHelp();
  }

  _._handleKeydown = function(event) {
    var reservedKeyCodeMethod = _.keyCodeFunctionDictionary[event.keyCode];
    if(reservedKeyCodeMethod) {
      reservedKeyCodeMethod(event);
    }
    if(_.noResponseKeyCodes.indexOf(event.keyCode) === -1) {
      _._addCharacterToCurrentLine(event.key)
    }
  }

  _._checkHotKeys = function(event) {
    if(event.keyCode === 17) {
      _.controlKeyIsPressed = true;
    } else if(event.keyCode === 91) {
      _.commandKeyIsPressed = true
    }
    if(_.controlKeyIsPressed && event.keyCode === 67) {
      // command + c
      _._newLine();
    } else if(_.commandKeyIsPressed && event.keyCode === 75) {
      // command + k
      _._clearConsole();
    }
  };

  _._resetHotKeys = function() {
    _.controlKeyIsPressed = false;
    _.commandKeyIsPressed = false;
  }

  _._displayPreviousCommand = function() {
    var previousCommandIndex = _.currentCommandHistoryIndex-1;
    var previousCommand = _.commandHistory[previousCommandIndex];
    if(previousCommand) {
      _.currentCommandHistoryIndex = previousCommandIndex;
      _._setInputText(previousCommand);
    }
  }

  _._displayNextCommand = function() {
    var nextCommandIndex = _.currentCommandHistoryIndex+1;
    var nextCommand = _.commandHistory[_.currentCommandHistoryIndex+1];
    if(nextCommand) {
      _.currentCommandHistoryIndex = nextCommandIndex;
      _._setInputText(nextCommand);
    } else {
      _._setInputText('');
      _._resetCommandHistoryIndex();
    }
  } 

  _._handleEnter = function(event) {
    var methodToRun = _.methodDictionary[_.currentUserInput.split(' ')[0]];
    var arguments = _.currentUserInput.split(' ')[1];
    if(_.currentUserInput !== "") {
      _._addCommandToHistory(_.currentUserInput);
    }
    if(methodToRun) {
      methodToRun.function(arguments);
    } else {
      _.invalidMethod(_.currentUserInput);
    }
  }

  _._addCharacterToCurrentLine = function(character) {
    _._setInputText(_.currentUserInput + character);
  }
  
  _._removeLastCharacterFromCurrentLine = function() {
    _._setInputText(_.currentUserInput.slice(0, _.currentUserInput.length-1));
  }

  _._setInputText = function(text) {
    _.currentUserInput = text;
    _.currentLineInput.innerText = _.currentUserInput;
  }

  _._addCommandToHistory = function(command) {
    _.commandHistory.push(command);
    localStorage.setItem('collinOSCommandHistory', JSON.stringify(_.commandHistory));
    _._resetCommandHistoryIndex();
  }

  _._resetCommandHistoryIndex = function() {
    _.currentCommandHistoryIndex = _.commandHistory.length;
  }

  _.invalidMethod = function(methodName) {
    console.error('Invalid method: '+methodName);
    _._logMessage('command not found: '+methodName);
  }

  _._invalidArgument = function(argParam, argGiven, allowedArgs) {
    var msg = 'Invalid arguments provided for '+argParam+': '+argGiven+'. Available arguments are: '+allowedArgs.join(', ')+'.';
    console.error(msg);
    _._logMessage(msg);
  }

  _._clearConsole = function() {
    _.console.innerHTML = '';
    _._newLine();
  }

  _._getArgument = function(argumentString, arg) {
    return argumentString.split(arg+'=')[1];
  }

  // available console methods
  _._logHelp = function(optionalMethod) {
    if(optionalMethod) {
      if(_.methodDictionary[optionalMethod]) {
        _._logMessage(_.methodDictionary[optionalMethod].help)
      } else {
        _.invalidMethod(optionalMethod)
      }
    } else {
      _._logMessage('Welcome to CollinOS!\n\
                      Run `help` at any time to see this list of available methods\n\
                      Run `help name` to find out more about the method `name`\n\n\
                      Basic Usage:\n\
                      Use the up and down arrows to rotate through your command history.\n\
                      Command + C starts a new line\n\
                      Command + K flushes the console\n\n\
                      Available commands:\n\
                      ls............................................................list content of directory\n\
                      pwd........................................................print current working directory\n\
                      clear......................................................flushes this console (equivalent of Command + k)\n\
                      email --method=[print|program]...........write an email to collin\n\
                      resume --format=[browser|download]...view collin\'s resume\n\
                      about....................................................learn more about collin\n\
                      linkedin.................................................view collin\'s linkedin');
    }
  }

  _._displayGui = function() {
    window.location.pathname = '/gui';
  }

  _._logAbout = function() {
    _._logMessage('Programmer, learner, teacher, basketball junkie, negroni enjoyer.')
  }

  _._email = function(methodArguments) {
    var method = _._getArgument(methodArguments, 'method') || 'print';
    if(method === 'print') {
      _._logMessage('collin\'s email: collinschneider3@gmail.com');
    } else if(method === 'program') {
      window.location.href = 'mailto:collinschneider3@gmail.com';
      _._newLine();
    } else {
      _._invalidArgument('method', method, ['print', 'program']);
    }
  }

  _._pwd = function() {
    _._logMessage(_.currentDirectoryName);
  }

  _._ls = function() {
    _._logMessage('resume.txt\nabout.txt');
  }

  // _._cd = function(directory) {
  //   if(directory === '..') {
  //     debugger;
  //     _.currentDirectoryName = _.currentDirectory.split('/');
  //   }
  //   _.currentDirectory
  // }

  _._linkedin = function() {
    window.open('https://www.linkedin.com/in/collinschneider');
    _._newLine();
  }

  _._logMessage = function(msg) {
    _._addCharacterToCurrentLine('\n');
    _._addResultsLine(msg)
    _._newLine();
  }

  _._addResultsLine = function(message) {
    var results = document.createElement('div');
    results.className = 'results';
    results.innerText = message;
    _.currentLine.append(results);
  }
  
  _._newLine = function() {
    if(_.currentLine) _.currentLine.className = 'line text';

    var newLine = document.createElement('div');
    newLine.className = 'line current text';
    
    var directory = document.createElement('div');
    directory.className = 'directory';
    directory.innerText = 'CollinOS:'+_.currentDirectoryName+'$'
    newLine.append(directory);
    
    var input = document.createElement('div');
    input.className = 'input';
    newLine.append(input);

    var lineBreak = document.createElement('div');
    lineBreak.className = 'line-break';
    
    _.currentLine = newLine;
    _.currentLineInput = input;
    _.currentUserInput = '';

    _.currentLine.appendChild(_.cursor);
    _.console.append(lineBreak);
    _.console.append(newLine);
  }
}