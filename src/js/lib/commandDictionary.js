const commandDictionary = {
  'help': {
    help: 'Run `help` at any time to see this list of available methods\n\
            Run `help name` to find out more about the method `name`'
  },
  'clear': {
    help: 'Use `clear` to flush the console clean.'
  },
  'gui': {
    help: 'Use `gui` to switch from the CLI view to the GUI.'
  },
  'curl': {
    help: 'Use `curl` to make a curl request to the (mandatory) URL endpoint provided.\n\n\
            Optional arguments:\n\
            --method or --X to specify the request method (GET, POST)\n\
            --data or -d to provide a JSON payload in your POST request (NO spaces)\n\n\
            Example:\n\
            curl https://www.google.com/foo --method=POST --data={"bar":"baz","hello":"world"}\n\n'
  },
  'about': {
    help: 'Use `about` to learn more about collin.'
  },
  'resume': {
    help: 'Use `resume` to take a peak at collin\'s resume.\n\
            Accepts the --format argument of `browser` or `download`. Default is `browser`.'
  },
  'email': {
    help: 'Use `email` to return collin\'s email.\n\
            Accepts the --method argument of `print` to print collin\'s email to STDOUT or `program` to compose an email in your default mail program. Default is `print`.'
  },
  'vi': {
    help: 'Use `vi` to open the vim editor with the specified file'
  },
  'pwd':{
    help: 'Use `pwd` to print current location'
  },
  'ls': {
    help: 'Use `ls` to list other files and directories.'
  },
  'cd': {
    help: 'Use `cd` to change directories.'
  },
  'cat': {
    help: 'Use `cat` to print content of the specified file.'
  },
  'mkdir': {
    help: 'Use `mkdir` to create a new directory with a specified path.'
  },
  'touch': {
    help: 'Use `touch` to create a new file with a specified path.'
  },
  'linkedin': {
    help: 'Use `linkedin` to open collin\'s LinkedIn page in a new tab in your browser.'
  }
};

export { commandDictionary };