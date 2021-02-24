# CollinOS :computer:
CollinOS is a javascript-based mock CLI for the web. Changes are not persistent (yet) and will be flushed on a page reload.

![caption](screenrecord.gif)
## Available Commands
```
help [?command]                     List all commands. Optional command argument for detailed information on specified command.
gui                                 Switch from the CLI view to the GUI.
clear                               Flush the console clean (or Command + K).
curl [url]                          Make a request to the provided endpoint.
ls [?directoryPath]                 List other files and directories.
cd [directoryPath]                  Change directories.
pwd                                 Print current working directory.
mkdir [directoryPathName]           Create a new directory with a specified path.
touch [filePathName]                Create a new file with a specified path.
rm [fileOrDirectoryPath]            Destroy the file or directory specified.
cat [filePath]                      Print content of the specified file.
vi [filePath]                       Open the vim editor with the specified file
email --method=[print|program]      Get collin's email.
about                               Learn more about collin.
linkedin                            Open collin's LinkedIn page in a new tab in your browser.
```
## Hot Keys
```
Command + K                         Flush the console (equivalent of the `clear` command).
Control + C                         Start a new line.
Up/Down Arrow                       Rotate through history of previous commands.
Tab                                 Autocomplete commands/files/directories.
Escape                              Exit to the GUI.
```
