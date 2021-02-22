class File {
  constructor({ name, directory, content = undefined }) {
    this._name = name;
    this._content = content;
    this._directory = directory;
  }

  get name() {
    return this._name;
  }

  get content() {
    return this._content;
  }

  get directory() {
    return this._directory;
  }

  set content(content) {
    this._content = content;
  }

  remove = () => {
    let newFiles = this.directory.files.filter(file => file !== this);
    this.directory.files = newFiles;
  }
}

export { File };