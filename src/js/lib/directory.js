class Directory {
  constructor({ directories = [], files = [], path, parentDirectory }) {
    this._directories = directories;
    this._files = files;
    this._path = path;
    this._parentDirectory = parentDirectory;
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
  
  get parentDirectory() {
    return this._parentDirectory;
  }

  dirName = () => {
    return this.parsedPath()[this.parsedPath().length-1];
  }

  findChildDirectory = dirName => {
    return this.directories.find(dir => dir.dirName() === dirName);
  }

  childDirectoryNames = () => {
    return this.directories.map(dir => dir.dirName());
  }

  isRoot = () => {
    return this.parentDirectory === undefined;
  }

  parsedPath = function() {
    let split = this.path.split('/');
    // remove the starting `/` if it's not the root dir
    return this.isRoot ? split : split.shift();
  }
}

export { Directory }