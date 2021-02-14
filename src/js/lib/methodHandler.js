class MethodHandler {
  constructor(commandLine) {
    this.commandLine = commandLine;
    this.commandHistory = this.commandLine.commandHistory;
    this.directoryNavigator = this.commandLine.directoryNavigator;
    this.availableMethods = ['help', 'clear', 'gui', 'curl', 'about', 'resume', 'email', 'pwd', 'ls', 'cd', 'linkedin'];
    this.commandDictionary = {
      '': {
        function: this.commandLine.newLine
      },
      'help': {
        function: this._logHelp,
        help: 'Run `help` at any time to see this list of available methods\n\
                Run `help name` to find out more about the method `name`'
      },
      'clear': {
        function: this._clearConsole,
        help: 'Use `clear` to flush the console clean.'
      },
      'gui': {
        function: this._displayGui,
        help: 'Use `gui` to switch from the CLI view to the GUI.'
      },
      'curl': {
        function: this._curl,
        help: 'Use `curl` to make a curl request to the (mandatory) URL endpoint provided.\n\n\
                Optional arguments:\n\
                --method or --X to specify the request method (GET, POST)\n\
                --data or -d to provide a JSON payload in your POST request (NO spaces)\n\n\
                Example:\n\
                curl https://www.google.com/foo --method=POST --data={"bar":"baz","hello":"world"}\n\n'
      },
      'about': {
        function: this._logAbout,
        help: 'Use `about` to learn more about collin.'
      },
      'resume': {
        function: this._presentResume,
        help: 'Use `resume` to take a peak at collin\'s resume.\n\
                Accepts the --format argument of `browser` or `download`. Default is `browser`.'
      },
      'email': {
        function: this._email,
        help: 'Use `email` to return collin\'s email.\n\
                Accepts the --method argument of `print` to print collin\'s email to STDOUT or `program` to compose an email in your default mail program. Default is `print`.'
      },
      'pwd':{
        function:  this._pwd,
        help: 'Use `pwd` to print current location'
      },
      'ls': {
        function: this._ls,
        help: 'Use `ls` to list other files and directories.'
      },
      'cd': {
        function: this._cd,
        help: 'Use `cd` to change directories.'
      },
      'cat': {
        function: this._cat,
        help: 'Use `cat` to print content of the specified file.'
      },
      'linkedin': {
        function: this._linkedin,
        help: 'Use `linkedin` to open collin\'s LinkedIn page in a new tab in your browser.'
      }
    }
    this._logHelp();
  }

  handleMethod = inputtedCommand => {
    var trimmedCommand = inputtedCommand.trim();
    var splitCommand = trimmedCommand.split(/\s(.+)/)
    var commandToRun = this.commandDictionary[splitCommand[0]];
    var args = splitCommand[1];
    if(trimmedCommand !== "") {
      this.commandHistory.addCommandToHistory(trimmedCommand);
    }
    if(commandToRun) {
      commandToRun.function(args);
    } else {
      this._invalidCommand(trimmedCommand);
    }
  }

  _invalidCommand = command => {
    this._logResult(`command not found: ${command}`);
  }

  _invalidArgument = (argParam, argGiven, allowedArgs) => {
    this._logResult(`Invalid arguments provided for ${argParam}: ${argGiven}. Available arguments are: ${allowedArgs.join(', ')}.`);
  }

  _getArgumentsWithoutParameter = argumentString => {
    if(argumentString) {
      return argumentString.split(' ').filter(arg => !arg.includes('='));
    }
  }

  _getArgument = (argumentString, arg) => {
    if(argumentString) {
      var split = argumentString.split(`${arg}=`)[1];
      if(split) {
        return split.split(/\s|&/)[0];
      }
    }
  }

  _clearConsole = () => {
    this.commandLine.clearConsole(true);
  }

  _logHelp = optionalMethod => {
    if(optionalMethod) {
      if(this.commandDictionary[optionalMethod]) {
        this._logResult(this.commandDictionary[optionalMethod].help)
      } else {
        this.invalidMethod(optionalMethod)
      }
    } else {
      this._logResult('Welcome to CollinOS!\n\
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

  _curl = commandArguments => {
    let xhr = new XMLHttpRequest();
    let url = this._getArgumentsWithoutParameter(commandArguments);
    xhr.addEventListener("load", resp => { 
      this._logResult(resp.currentTarget.responseText);

    });
    if(!url || url.length === 0) {
      this._logResult('No URL specified in the `curl` command. Run `curl help` for more information on the CollinOS `curl` command.')
    } else if(url.length > 1) {
      this._logResult('Multiple un-named arguments passed to the `curl` command. Only one un-named argument is allowed in order to specify the `url` option.');
    } else {
      let method = this._getArgument(commandArguments, 'X') || this._getArgument(commandArguments, 'method') || 'GET';
      let data = this._getArgument(commandArguments, 'data') || this._getArgument(commandArguments, 'd');
      let corsProxyUrl = 'https://proxy-server-collin.herokuapp.com/proxy'
      let xhrUrl = `${corsProxyUrl}?url=${url[0]}&method=${method}&data=${data}`;
      xhr.open('GET', xhrUrl)
      xhr.send();
    }
  }

  _cd = directory => {
    try {
      this.directoryNavigator.changeDirectory(directory);
      this.commandLine.newLine();
    } catch(e) {
      this._logResult(`no such directory ${directory}`);
    }
  }

  _cat = path => {
    try {
      let file = this.directoryNavigator.getFile(path);
      if(file) {
        this._logResult(file.content);
      } else {
        this._logResult(`no such file ${path}`);
      }
    } catch(e) {
      this._logResult(`no such file ${path}`);
    }
  }

  _displayGui = () => {
    window.location.pathname = '/gui';
  }

  _logAbout = () => {
    this._logResult('Programmer, basketball junkie, negroni enjoyer.')
  }

  _email = methodArguments => {
    var method = this._getArgument(methodArguments, 'method') || 'print';
    if(method === 'print') {
      this._logResult('collin\'s email: collinschneider3@gmail.com');
    } else if(method === 'program') {
      window.location.href = 'mailto:collinschneider3@gmail.com';
      this.commandLine.newLine();
    } else {
      this._invalidArgument('method', method, ['print', 'program']);
    }
  }

  _presentResume = () => {
    this._logResult('not yet implemented.');
  }

  _pwd = () => {
    this._logResult(this.directoryNavigator.currentDirectory.path);
  }

  _ls = directory => {
    this._logResult(this.directoryNavigator.listDirectoryContent(directory || '.').join('\n'));
  }

  _linkedin = () => {
    window.open('https://www.linkedin.com/in/collinschneider');
    this.commandLine.newLine();
  }

  _logResult = (msg, options) => {
    options = options || {};
    this.commandLine.addResultsLine(msg)
    if(!options.disableNewLine) {
      this.commandLine.newLine();
    }
  }
}

export { MethodHandler };