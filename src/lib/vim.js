import { VimActionArea } from './vimActionArea.js';
import { VimContentArea } from './vimContentArea.js';

class Vim {
  constructor(commandLine) {
    this._commandLine = commandLine;
    this.vimContainer = this.commandLine.vimEditorContainer;
    this.vimContentArea = new VimContentArea(this.vimContainer.querySelector('#vim-editor-input-area'));
    this.vimActionArea = new VimActionArea(this, this.vimContainer.querySelector('#vim-editor-action-area'));
    this.hideEditor();
  }

  get commandLine() {
    return this._commandLine;
  }

  quit = () => {
    this.commandLine.hideVimEditor();
    this.commandLine.newLine();
  }

  save = () => {
    this.currentFile.content = this.vimContentArea.currentContent();
    this.commandLine.hideVimEditor();
    this.commandLine.newLine();
  }

  displayEditor = file => {
    this.currentFile = file;
    this.vimContentArea.setContent(file.content || '');
    this._setListeners();
    this.commandLine.userInputsContainer.classList.add('hidden');
    this.vimContainer.classList.remove('hidden');
  }

  hideEditor = () => {
    this.currentFile = undefined;
    this.vimContentArea.clear();
    this.vimContentArea.inActivate();
    this.vimActionArea.clear();
    this.vimActionArea.inActivate();
    this.commandLine.userInputsContainer.classList.remove('hidden');
    this.vimContainer.classList.add('hidden');
    this._removeListeners();
  }

  _setListeners = () => {
    window.addEventListener('keydown', this._handleKeyDown);
  }

  _removeListeners = () => {
    window.removeEventListener('keydown', this._handleKeyDown);
  }

  _handleKeyDown = keyboardEvent => {
    this._checkEscapeKey(keyboardEvent);
    if(this.vimContentArea.isActive()) {
      this.vimContentArea.handleKeydown(keyboardEvent)
    } else if(this.vimActionArea.isActive()) {
      this.vimActionArea.handleKeydown(keyboardEvent)
    } else {
      let keyFunction = {
        'i': this._onIKeyForInsertMode,
        ':': this._onColonKeyForActionArea
      }[keyboardEvent.key];
      if(keyFunction) keyFunction();
    }
  }

  _checkEscapeKey = keyboardEvent => {
    if(keyboardEvent.key === 'Escape') {
      this.vimActionArea.inActivateInsertMode();
      this.vimActionArea.inActivate();
      this.vimContentArea.inActivate();
      this.vimContentArea.moveCursorToEndOfContent();
    }
  }

  _onIKeyForInsertMode = () => {
    this.vimContentArea.activate();
    this.vimActionArea.activateInsertMode();
  }

  _onColonKeyForActionArea = () => {
    this.vimActionArea.enableUserInput();
    this.vimContentArea.inActivate();
    this.vimContentArea.hideCursor();
  }
}

export { Vim }