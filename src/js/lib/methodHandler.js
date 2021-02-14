import { commandDictionary } from './commandDictionary.js';
import { FileDirectoryManager } from './fileDirectoryManager.js';

class MethodHandler {
  constructor(commandLine) {
    this.commandLine = commandLine;
    this.commandHistory = this.commandLine.commandHistory;
    this.navigator = this.commandLine.navigator;
    this.commandDictionary = commandDictionary;
    this.availableMethods = Object.keys(this.commandDictionary);
    this.fileDirectoryManager = new FileDirectoryManager(this.navigator);
    this._help();
  }

  handleMethod = inputtedCommand => {
    var trimmedCommand = inputtedCommand.trim();
    if(trimmedCommand === "") {
      this.commandLine.newLine();
    } else {
      var splitCommand = trimmedCommand.split(/\s(.+)/)
      var commandToRun = this.commandDictionary[splitCommand[0]];
      this.commandHistory.addCommandToHistory(trimmedCommand);
      if(commandToRun) {
        this[`_${splitCommand[0]}`](splitCommand[1]);
      } else {
        this._invalidCommand(trimmedCommand);
      }
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

  _help = optionalMethod => {
    if(optionalMethod) {
      if(this.commandDictionary[optionalMethod]) {
        this._logResult(this.commandDictionary[optionalMethod].help)
      } else {
        this._invalidCommand(optionalMethod)
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
      this.navigator.changeDirectory(directory);
      this.commandLine.newLine();
    } catch(e) {
      this._logResult(`no such directory ${directory}`);
    }
  }

  _mkdir = directoryPath => {
    try {
      this.fileDirectoryManager.createDirectory(directoryPath);
      this.commandLine.newLine();
    } catch(e) {
      this._logResult(e.message);
    }
  }

  _touch = filePath => {
    try {
      this.fileDirectoryManager.createFile(filePath);
      this.commandLine.newLine();
    } catch(e) {
      this._logResult(e.message);
    }
  }

  _cat = path => {
    try {
      let file = this.navigator.getFile(path);
      if(file) {
        this._logResult(file.content);
      } else {
        this._logResult(`no such file ${path}`);
      }
    } catch(e) {
      this._logResult(`no such file ${path}`);
    }
  }

  _gui = () => {
    window.location.pathname = '/gui';
  }

  _about = () => {
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

  _resume = () => {
    this._logResult('not yet implemented.');
  }

  _pwd = () => {
    this._logResult(this.navigator.currentDirectory.path);
  }

  _ls = directory => {
    this._logResult(this.navigator.listDirectoryContent(directory || '.').join('\n'));
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