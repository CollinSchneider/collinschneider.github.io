class KeyHandler {
  constructor(commandLine) {
    this.commandLine = commandLine;
    this.controlKeyIsPressed = false;
    this.commandKeyIsPressed = false;
    this.listenersPaused = false;

    this.noResponseKeyCodes = [8, 9, 13, 20, 16, 17, 18, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124];
    this.keyCodeFunctionDictionary = {
      8: this._onBackspace,
      13: this._onEnter,
      38: this._onUpKey,
      40: this._onDownKey,
      37: this._onLeftKey,
      39: this._onRightKey,
      9: this._onTab
    }
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('keydown', this.checkHotKeys);
    window.addEventListener('keyup', this.resetHotKeys);
  }

  pauseListeners = () => {
    this.listenersPaused = true;
  }

  resumeListeners = () => {
    this.listenersPaused = false;
  }

  handleKeydown = keyboardEvent => {
    if(!this.listenersPaused) {
      let reservedKeyCodeMethod = this.keyCodeFunctionDictionary[keyboardEvent.keyCode];
      if(reservedKeyCodeMethod) {
        reservedKeyCodeMethod(keyboardEvent);
      }
      if(!this.controlKeyIsPressed && !this.commandKeyIsPressed && this.noResponseKeyCodes.indexOf(event.keyCode) === -1) {
        this.commandLine.addCharacterToUserInput(keyboardEvent.key);
      }
    }
  }

  checkHotKeys = keyboardEvent => {
    if(!this.listenersPaused) {
      switch(keyboardEvent.keyCode) {
        case 17:
          this.controlKeyIsPressed = true;
          break;
        case 91:
          this.commandKeyIsPressed = true;
          break;
        case 93:
          this.commandKeyIsPressed = true;
          break;
        case 75:
          if(this.commandKeyIsPressed) this.commandLine.clearConsole();
          break;
        case 67:
          if(this.controlKeyIsPressed) this.commandLine.newLine();
          break;
        default:
          // not a hot key
          break;
      }
    }
  };

  resetHotKeys = keyboardEvent => {
    if(!this.listenersPaused) {
      if(keyboardEvent.keyCode === 17) {
        this.controlKeyIsPressed = false;
      } else if(keyboardEvent.keyCode === 91 || keyboardEvent.keyCode === 93) {
        this.commandKeyIsPressed = false;
      }
    }
  }

  pauseListeners = () => {
    this.listenersPaused = true;
  }
  
  resumeListeners = () => {
    this.listenersPaused = false;
  }

  _onBackspace = () => {
    this.commandLine.removeCharacterInFocus();
  }

  _onUpKey = () => {
    let previousCommand = this.commandLine.commandHistory.tryRotateToPreviousCommand();
    if(previousCommand) {
      this.commandLine.clearCurrentLine();
      setTimeout(() => {
        this.commandLine.setInputText(previousCommand)
      }, 50)
    }
  }

  _onDownKey = () => {
    let nextCommand = this.commandLine.commandHistory.tryRotateToNextCommand();
    if(nextCommand) {
      this.commandLine.clearCurrentLine();
      setTimeout(() => {
        this.commandLine.setInputText(nextCommand);
      }, 50)
    } else {
      this.commandLine.setInputText('');
    }
  }

  _onLeftKey = () => {
    this.commandLine.tryMovingCursorBack();
  }

  _onRightKey = () => {
    this.commandLine.tryMovingCursorForward();
  }

  _onEnter = () => {
    this.commandLine.methodHandler.handleMethod(this.commandLine.currentUserInput)
  }

  _onTab = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    let attemptedCommand = this.commandLine.currentUserInput.trim();
    let splitUserInput = attemptedCommand.split(' ');
    let userInputToAutoComplete = splitUserInput[splitUserInput.length-1];
    if(['ls', 'cd', 'cat', 'mkdir', 'touch', 'rm', 'vi'].includes(splitUserInput[0])) {
      let availableDirectoriesAndFiles = this.commandLine.navigator.availableDirectoriesAndFilesForUserInput(splitUserInput[1]);
      this._handleAutoCompleteResults(availableDirectoriesAndFiles, splitUserInput[0]);
    } else {
      let availableCommands = this.commandLine.methodHandler.availableMethods.filter(method => method.startsWith(userInputToAutoComplete));
      let formattedCommmands = availableCommands.map(command => command + ' '); // add whitespace
      this._handleAutoCompleteResults(formattedCommmands);
    }
  }

  _handleAutoCompleteResults = (autoCompleteResults, frontCommand = null) => {
    let attemptedCommand = this.commandLine.currentUserInput;
    if(autoCompleteResults.length === 0) {
      this.commandLine.clearCurrentLine();
      setTimeout(() => {
        this.commandLine.setInputText(attemptedCommand);
      }, 50);
    } else if(autoCompleteResults.length === 1) {
      let autoCompleteValue = frontCommand ? `${frontCommand} ${autoCompleteResults[0]}` : autoCompleteResults[0]
      this.commandLine.setInputText(autoCompleteValue);
    } else {
      this.commandLine.addResultsLine(autoCompleteResults.join('\n'));
      this.commandLine.newLine();
      this.commandLine.setInputText(attemptedCommand);
    }
  }
}

export { KeyHandler };