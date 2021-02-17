class VimContentArea {
  constructor(contentAreaEl) {
    this.contentArea = contentAreaEl;
    this.characterElements = [];
    this.noResponseKeyCodes = [8, 9, 13, 20, 16, 17, 18, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124];
    this._createCursor();
  }

  activate = () => {
    this.active = true;
  }

  inActivate = () => {
    this.active = false;
  }

  isActive = () => {
    return this.active;
  }

  showCursor = () => {
    this.cursor.classList.remove('hidden');
  }

  hideCursor = () => {
    this.cursor.classList.add('hidden');
  }

  handleKeydown = keyboardEvent => {
    let reservedKeyFunction = {
      'Escape': this._onEscapeKey,
      'ArrowLeft': this._onLeftKey,
      'ArrowRight': this._onRightKey,
      'Backspace': this._onBackspace,
      'Enter': this._onEnterKey
    }[keyboardEvent.key];
    if(reservedKeyFunction) reservedKeyFunction();
    if(!this.noResponseKeyCodes.includes(keyboardEvent.keyCode)) {
      this.addCharacter(keyboardEvent.key);
    }
  }

  clear = () => {
    this.contentArea.innerHTML = '';
    this.cursor = undefined;
    this.characterElements = [];
    this._createCursor();
  }

  setContent = content => {
    content.split('').forEach(this.addCharacter);
  }

  currentContent = () => {
    return this.characterElements.map(el => el.innerText).join('');
  }

  moveCursor = index => {
    let characterElToPutCursorInFrontOf = this.characterElements[index < 0 ? 0 : index];
    if(characterElToPutCursorInFrontOf) {
      this.cursorIndex = index;
      this.contentArea.insertBefore(this.cursor, characterElToPutCursorInFrontOf);
    } else {
      this.cursorIndex = this.characterElements.length;
      this.contentArea.append(this.cursor);
    }
    this.showCursor();
  }

  moveCursorToEndOfContent = () => {
    this.moveCursor(this.characterElements.length);
  }

  addCharacter = character => {
    let el = document.createElement('span');
    el.className = 'text character';
    el.innerText = character;
    this.characterElements.splice(this.cursorIndex, 0, el);
    this.contentArea.insertBefore(el, this.cursor);
    this.cursorIndex+=1;
  }

  _onLeftKey = () => {
    this.moveCursor(this.cursorIndex-1);
  }

  _onRightKey = () => {
    this.moveCursor(this.cursorIndex+1)
  }

  _onEnterKey = () => {
    this.addCharacter('\n');
  }

  _onBackspace = () => {
    let characterElement = this.characterElements[this.cursorIndex-1];
    if(characterElement) {
      characterElement.remove();
      this.characterElements.splice(this.cursorIndex-1, 1);
      this.cursorIndex -= 1;
    }
  }

  _createCursor = () => {
    if(!this.cursor) {
      this.cursor = document.createElement('span');
      this.cursor.id = 'vim-content-area-cursor';
      this.cursor.className = 'blinking text';
      this.cursor.innerText = '_';
      this.contentArea.append(this.cursor);
      this.cursorIndex = 0;
    }
  }
}

export { VimContentArea };