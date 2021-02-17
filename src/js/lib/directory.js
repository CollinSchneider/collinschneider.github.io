class Directory {
  constructor({ directories = [], files = [], path, parentDirectory }) {
    this._directories = directories;
    this._files = files;
    this._path = path;
    this._parentDirectory = parentDirectory;
    this._checkValidity();
  }

  get directories() {
    return this._directories;
  }

  set directories(directoryOrDirectories) {
    if(directoryOrDirectories.constructor.name === 'Directory') {
      this._directories.push(directoryOrDirectories) 
    } else if(directoryOrDirectories.constructor.name === 'Array') {
      this._directories = directoryOrDirectories
    }
  }

  get path() {
    return this._path;
  }

  get files() {
    return this._files;
  }

  set files(fileOrFiles) {
    if(fileOrFiles.constructor.name === 'File') {
      this._files.push(fileOrFiles) 
    } else if(fileOrFiles.constructor.name === 'Array') {
      this._files = fileOrFiles
    }
  }
  
  get parentDirectory() {
    return this._parentDirectory;
  }

  static parsePath(stringPath) {
    let formatted = stringPath.startsWith('/') ? stringPath.slice(1, stringPath.length) : stringPath;
    return formatted.split('/')
  }

  remove = directoryWithIn => {
    if(this._canRemove(directoryWithIn)) {
      let newDirectories = this.parentDirectory.directories.filter(dir => dir !== this);
      this.parentDirectory.directories = newDirectories;
    } else {
      throw new Error('cannot remove directory while within it.');
    }
  }

  addDirectory = directory => {
    this.directories = directory;
  }

  addFile = file => {
    this.files = file;
  }

  dirName = () => {
    return this.parsedPath()[this.parsedPath().length-1];
  }
 
  fileNames = () => {
    return this.files.map(file => file.name);
  }

  findChildDirectory = dirName => {
    return this.directories.find(dir => dir.dirName() === dirName);
  }

  childDirectoryNames = () => {
    return this.directories.map(dir => dir.dirName());
  }

  isChildOfDirectory = directory => {
    if(this.parentDirectory) {
      if(this.parentDirectory === directory) {
        return true;
      } else {
        return this.parentDirectory.isChildOfDirectory(directory);
      }
    }
  }

  getFile = fileName => {
    return this.files.find(file => file.name === fileName);
  }

  isRoot = () => {
    return this.parentDirectory === undefined;
  }

  parsedPath = () => {
    let split = this.path.split('/');
    // remove the starting `/` if it's not the root dir
    return this.isRoot ? split : split.shift();
  }

  _canRemove = directoryWithIn => {
    return !this.isRoot() && !directoryWithIn.isChildOfDirectory(this)
  }

  _checkValidity = () => {
    if(this.path.startsWith('.')) throw Error('path cannot start with `.`');
  }
}

export { Directory }