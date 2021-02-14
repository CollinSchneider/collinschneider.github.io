import { Directory } from './directory.js';
import { commandDictionary } from './commandDictionary.js';
import { File } from './file.js';

class FileDirectoryManager {
  constructor(navigator) {
    this._navigator = navigator;
    this.reservedNames = ['..', '.'].concat(Object.keys(commandDictionary));
  }

  get navigator() {
    return this._navigator;
  }

  createDirectory = (directoryPath, { dontThrowErrorOnNoDirCreated = false, dontSwitchBackToStartingDirectory = false }) => {
    let parsedDirectoryPath = Directory.parsePath(directoryPath);
    let startingDirectory = this.navigator.currentDirectory;
    let directoryCreated = false;
    parsedDirectoryPath.forEach(dirName => {
      let existingDir = this.navigator.getDirectory(dirName);
      if(existingDir) {
        this.navigator.currentDirectory = existingDir;
      } else {
        directoryCreated = true;
        let newDir = new Directory({ parentDirectory: this.navigator.currentDirectory, path: [this.navigator.currentDirectory.path, dirName].join('/') });
        this.navigator.currentDirectory.addDirectory(newDir);
        this.navigator.currentDirectory = newDir;
      }
    })
    if(!dontSwitchBackToStartingDirectory) this.navigator.currentDirectory = startingDirectory;
    if(!directoryCreated && !dontThrowErrorOnNoDirCreated) throw Error(`Directory already exists ${directoryPath}`)
  }

  removeDirectory = () => {

  }

  createFile = filePath => {
    let parsedFilePath = Directory.parsePath(filePath);
    let newFileName = parsedFilePath.pop();
    let startingDirectory = this.navigator.currentDirectory;
    this.createDirectory(parsedFilePath.join('/'), { 
      dontThrowErrorOnNoDirCreated: true,
      dontSwitchBackToStartingDirectory: true
    });
    let newFile = new File({ name: newFileName });
    this.navigator.currentDirectory.addFile(newFile);
    this.navigator.currentDirectory = startingDirectory;
  }
}

export { FileDirectoryManager }