import { CommandHistory } from './commandHistory.js';
import { Navigator } from './navigator.js';
import { KeyHandler } from './keyHandler.js';
import { MethodHandler } from './methodHandler.js'

class CommandLine {
  constructor(element) {
    this.commandLineEl = element;
    this.currentUserInput = '',
    this._createCursor();

    this.hiddenMobileInput = document.querySelector('#hidden-input-container'),
    this.characterElementsInputted = [],
    this.currentCursorIndex = this.characterElementsInputted.length-1;
    
    this.navigator = new Navigator(this);
    this.newLine();
    
    this.commandHistory = new CommandHistory;
    this.keyHandler = new KeyHandler(this);
    this.methodHandler = new MethodHandler(this);
  }

  setInputText = text => {
    this.clearCurrentLine();
    text.split('').forEach(this.addCharacterToUserInput);
  }

  addCharacterToUserInput = character => {
    var charEl = document.createElement('span');
    charEl.className = 'character';
    charEl.innerText = character;
    this.currentLineUserInputEl.insertBefore(charEl, this.characterElementsInputted[this.currentCursorIndex+1]);
    this.characterElementsInputted.splice(this.currentCursorIndex+1, 0, charEl);
    this.currentUserInput = this.characterElementsInputted.map(el => el.innerText).join('');
    this._moveCursorToPosition(this.currentCursorIndex+1);
  }

  removeCharacterInFocus = () => {
    var element = this.characterElementsInputted[this.currentCursorIndex];
    if(element) {
      element.remove();
      this.characterElementsInputted.splice(this.currentCursorIndex, 1);
      this.currentUserInput = this.characterElementsInputted.map(el => el.innerText).join('');
      this.currentCursorIndex -= 1;
    }
  }

  clearConsole = (clearUserInput = false) => {
    this.commandLineEl.innerHTML = '';
    var userInputBeforeClear = this.currentUserInput;
    this.newLine();
    if(!clearUserInput) {
      this.setInputText(userInputBeforeClear);
    }
  }

  tryMovingCursorForward = () => {
    this._moveCursorToPosition(this.currentCursorIndex+1)
  }

  tryMovingCursorBack = () => {
    this._moveCursorToPosition(this.currentCursorIndex-1)
  }

  addResultsLine = message => {
    var results = document.createElement('div');
    results.className = 'results';
    results.innerText = message;
    this.currentLineEl.append(results);
  }
  
  newLine = () => {
    var newLine = document.createElement('div');
    newLine.className = 'line text';
    
    var directory = document.createElement('div');
    directory.className = 'directory';
    directory.innerText = `CollinOS:${this.navigator.currentDirectory.path}$`
    newLine.append(directory);
    
    var input = document.createElement('div');
    input.className = 'user-input';
    newLine.append(input);
    
    this.currentLineEl = newLine;
    this.currentLineUserInputEl = input;
    this.currentUserInput = '';

    input.appendChild(this.cursor);
    this.commandLineEl.append(newLine);
    this.characterElementsInputted = [];
    this.currentCursorIndex = -1;
    this._moveHiddenInputToFocusedLine(newLine);
    window.scrollTo(0, window.innerHeight);
  }

  clearCurrentLine = () => {
    this.characterElementsInputted.forEach(el => el.remove());
    this.characterElementsInputted = [];
    this.currentCursorIndex = -1;
  }

  _moveCursorToPosition = index => {
    var begginingOfUserInputIndex = -1;
    var endOfUserInputIndex = this.characterElementsInputted.length-1;
    if(index >= begginingOfUserInputIndex && index <= endOfUserInputIndex) {
      var nextCharacter = this.characterElementsInputted[index+1];
      this.currentCursorIndex = index;
      if(nextCharacter) {
        this.currentLineUserInputEl.insertBefore(this.cursor, nextCharacter)
      } else {
        this.currentLineUserInputEl.append(this.cursor);
      }
    }
  }

  _moveHiddenInputToFocusedLine = newLine => {
    var rect = newLine.getBoundingClientRect();
    this.hiddenMobileInput.style.top = `${rect.top}px`;
  }
  
  _createCursor = () => {
    if(!this.cursor) {
      this.cursor = document.createElement('div');
      this.cursor.id = 'cursor'
      this.cursor.className = 'blinking text';
      this.cursor.innerText = '_';
    }
  }
}

export { CommandLine };