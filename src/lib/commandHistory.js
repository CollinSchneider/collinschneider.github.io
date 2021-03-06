class CommandHistory {
  constructor() {
    this.commandHistory = JSON.parse(localStorage.getItem('collinOSCommandHistory') || '[]'),
    this.currentCommandHistoryIndex = this.commandHistory.length;
  }
  
  addCommandToHistory = command => {
    this.commandHistory.push(command);
    localStorage.setItem('collinOSCommandHistory', JSON.stringify(this.commandHistory));
    this.currentCommandHistoryIndex = this.commandHistory.length;
  }

  tryRotateToPreviousCommand = () => {
    let previousCommandIndex = this.currentCommandHistoryIndex-1;
    let previousCommand = this.commandHistory[previousCommandIndex];
    if(previousCommand) {
      this.currentCommandHistoryIndex = previousCommandIndex;
      return previousCommand;
    }
  }

  tryRotateToNextCommand = () => {
    let nextCommandIndex = this.currentCommandHistoryIndex+1;
    let nextCommand = this.commandHistory[this.currentCommandHistoryIndex+1];
    if(nextCommand) {
      this.currentCommandHistoryIndex = nextCommandIndex;
      return nextCommand
    } else {
      this.currentCommandHistoryIndex = this.commandHistory.length;
    }
  }
}

export { CommandHistory }