class VimActionArea {
  constructor(vim, actionAreaEl) {
    this.actionArea = actionAreaEl;
    this.vim = vim;
    this.characterElements = [];
    this.currentCommand = '';
    this.noResponseKeyCodes = [8, 9, 13, 20, 16, 17, 18, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124];
    this._createCursor();
  }

  activate = () => {
    this.show();
    this.active = true;
  }

  inActivate = () => {
    this.clear();
    this.hide();
    this.active = false;
  }

  isActive = () => {
    return this.active;
  }

  show = () => {
    this.actionArea.classList.remove('hidden');
  }

  hide = () => {
    this.actionArea.classList.add('hidden');
  }

  activateInsertMode = () => {
    '- INSERT -'.split('').forEach(this.addCharacter);
    this.hideCursor();
    this.show();
  }

  inActivateInsertMode = () => {
    this.actionArea.innerHTML = '';
    this.hide();
  }

  handleKeydown = keyboardEvent => {
    let keyFunction = {
      'ArrowLeft': this._moveCursorLeft,
      'ArrowRight': this._moveCursorRight,
      'Backspace': this._onBackspace,
      'Enter': this._onEnter
    }[keyboardEvent.key];
    if(keyFunction) keyFunction();
    if(!this.noResponseKeyCodes.includes(keyboardEvent.keyCode)) {
      this.addCharacter(keyboardEvent.key);
      this.currentCommand += keyboardEvent.key;
    }
  }

  moveCursor = index => {
    let safeIndex = index < 0 ? 0 : index
    let characterElToPutCursorInFrontOf = this.characterElements[safeIndex];
    if(characterElToPutCursorInFrontOf) {
      this.cursorIndex = safeIndex;
      this.actionArea.insertBefore(this.cursor, characterElToPutCursorInFrontOf);
    } else {
      this.cursorIndex = this.characterElements.length;
      this.actionArea.append(this.cursor);
    }
  }

  hideCursor = () => {
    this.cursor.classList.add('hidden');
  }

  showCursor = () => {
    this.cursor.classList.remove('hidden');
  }

  clear = () => {
    this.actionArea.innerHTML = '';
    this.cursor = undefined;
    this.currentCommand = '';
    this.characterElements = [];
    this._createCursor();
  }

  enableUserInput = () => {
    this.clear();
    this.addCharacter(':');
    this.activate();
  }

  addCharacter = character => {
    let el = document.createElement('span');
    el.className = 'text character';
    el.innerText = character;
    let elToInsertBefore = this.characterElements[this.cursorIndex+1] || this.cursor;
    this.characterElements.splice(this.cursorIndex+1, 0, el);
    this.actionArea.insertBefore(el, elToInsertBefore);
    this.cursorIndex+=1;
  }

  _onEnter = () => {
    let command = {
      'q': this.vim.quit,
      'wq': this.vim.save
    }[this.currentCommand];
    if(command) {
      command();
    } else {
      this._displayError(`Invalid command: ${this.currentCommand}. Valid commands are \`q\`(quit) and \`wq\`(write & quit)`);
    }
  }

  _displayError = msg => {
    this.clear();
    msg.split('').forEach(this.addCharacter);
  }

  _onBackspace = () => {
    let characterElement = this.characterElements[this.cursorIndex-1];
    if(characterElement) {
      characterElement.remove();
      this.characterElements.splice(this.cursorIndex-1, 1);
      this.cursorIndex -= 1;
      if(this.characterElements.length === 0) {
        this.inActivate();
      }
    }
  }

  _moveCursorLeft = () => {
    this.moveCursor(this.cursorIndex-1);
  }

  _moveCursorRight = () => {
    this.moveCursor(this.cursorIndex+1);
  }

  _createCursor = () => {
    if(!this.cursor) {
      this.cursor = document.createElement('span');
      this.cursor.id = 'vim-action-area-cursor';
      this.cursor.className = 'blinking text';
      this.cursor.innerText = '_';
      this.actionArea.append(this.cursor);
      this.cursorIndex = 0;
    }
  }
}

export { VimActionArea };