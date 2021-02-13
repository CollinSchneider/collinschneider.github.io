import { rootDir, collinDir } from './fileStructure.js';

class DirectoryNavigator {
  constructor() {
    this._rootDirectory = rootDir;
    this._currentDirectory = localStorage.getItem('currentDirectoryPath') ? 
      this._getDirectory(localStorage.getItem('currentDirectoryPath')) : collinDir;
  }

  get rootDirectory() {
    return this._rootDirectory;
  }

  get currentDirectory() {
    return this._currentDirectory;
  }

  set currentDirectory(directory) {
    this._currentDirectory = directory;
  }

  changeDirectory = directoryFullPath => {
    if(directoryFullPath !== '.') {
      let directory = this._getDirectory(directoryFullPath);
      if(directory) {
        localStorage.setItem('currentDirectoryPath', directory.path)
        this.currentDirectory = directory;
      } else {
        throw new Error(`invalid directory ${directoryFullPath}`);
      }
    }
  }

  listDirectoryContent = directoryFullPath => {
    if(directoryFullPath === '.') {
      return this._directoryContent(this.currentDirectory);
    } else {
      let directory = this._getDirectory(directoryFullPath);
      if(directory) {
        return this._directoryContent(directory)
      }
    }
  }

  availableDirectoriesForInput = userInput => {
    let parsedDirectoryPath = userInput ? this._parsedUserInputDirectory(userInput) : [];
    let userInputtedValue = parsedDirectoryPath.pop();
    let startingDirectory = parsedDirectoryPath.length === 0 ? this.currentDirectory : this._getDirectory(parsedDirectoryPath.join('/'));
    if(this._tabbedUserInputIsValidDirectory(userInputtedValue, startingDirectory)) {
      let validInputtedDirectory = this._getDirectory(userInput);
      if(validInputtedDirectory) {
        let availableDirectoryNames = validInputtedDirectory.childDirectoryNames();
        // only one possible directory to go to, return the full path to update the user's input
        if(availableDirectoryNames.length === 1) {
          return [[userInput, availableDirectoryNames[0]].join('/')]
        } else {
          return availableDirectoryNames;
        }
      } else {
        return []
      }
    } else {
      let matchingPaths = startingDirectory.childDirectoryNames().filter(dirName => dirName.startsWith(userInputtedValue || ''));
      if(matchingPaths.length === 1) {
        // only one match, return the full path to update the user's input
        if(userInput && userInput.startsWith('/')) parsedDirectoryPath.unshift('')
        return [[parsedDirectoryPath.join('/'), matchingPaths[0]].join('/')]
      } else  {
         // many results, only return paths to log results
        return matchingPaths
      }
    }
  }

  _tabbedUserInputIsValidDirectory = (userInput, currentDir) => {
    return userInput === '..' || userInput === '~' || currentDir.childDirectoryNames().includes(userInput);
  }

  _getDirectory = directoryFullPath => {
    let directoryToStartFrom = directoryFullPath.startsWith('~') ? this.rootDirectory : this.currentDirectory
    return this._traverseToDirectory(this._parsedUserInputDirectory(directoryFullPath), directoryToStartFrom);
  }

  _traverseToDirectory = (parsedDirectoryPathToGoTo, directoryIn) => {
    let nextDirectoryName = parsedDirectoryPathToGoTo.shift();
    let nextDirectory = nextDirectoryName === '~' ?
                          this.rootDirectory : nextDirectoryName === '..' ? 
                            directoryIn.parentDirectory : directoryIn.findChildDirectory(nextDirectoryName);
    if(parsedDirectoryPathToGoTo.length > 0) {
      return this._traverseToDirectory(parsedDirectoryPathToGoTo, nextDirectory);
    } else {
      return nextDirectory;
    }
  }

  _directoryContent = directory => {
    return (directory.files || []).concat(directory.childDirectoryNames());
  }

  _parsedUserInputDirectory = stringDirectory => {
    let formatted = stringDirectory.startsWith('/') ? stringDirectory.slice(1, stringDirectory.length) : stringDirectory;
    return formatted.split('/')
  }
}

export { DirectoryNavigator };