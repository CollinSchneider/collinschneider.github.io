const commandDictionary = {
  'help': {
    detailedHelp: 'Run `help` at any time to see this list of available methods\n\
            Run `help name` to find out more about the method `name`',
    generalHelp: 'Run `help` at any time to see this list of available methods\n\
    Run `help name` to find out more about the method `name`',
  },
  'clear': {
    detailedHelp: 'Use `clear` to flush the console clean (or Command + K).',
    generalHelp: 'Flush the console clean (or Command + K).'
  },
  'gui': {
    detailedHelp: 'Use `gui` to switch from the CLI view to the GUI.',
    generalHelp: 'Switch from the CLI view to the GUI.'
  },
  'curl': {
    detailedHelp: 'Use `curl` to make a curl request to the (mandatory) URL endpoint provided.\n\n\
            Optional arguments:\n\
            --method or --X to specify the request method (GET, POST)\n\
            --data or -d to provide a JSON payload in your POST request (NO spaces)\n\n\
            Example:\n\
            curl https://www.google.com/foo --method=POST --data={"bar":"baz","hello":"world"}\n\n',
    generalHelp: 'Make a request to the provided endpoint.'
  },
  'about': {
    detailedHelp: 'Use `about` to learn more about collin.',
    generalHelp: 'Learn more about collin.'
  },
  // 'resume': {
  //   detailedHelp: 'Use `resume` to take a peak at collin\'s resume.\n\
  //           Accepts the --format argument of `browser` or `download`. Default is `browser`.',
  //   generalHelp: 'Use `resume` to view collin\'s resume.'
  // },
  'email': {
    detailedHelp: 'Use `email` to return collin\'s email.\n\
            Accepts the --method argument of `print` to print collin\'s email to STDOUT or `program` to compose an email in your default mail program. Default is `print`.',
    generalHelp: 'Get collin\'s email.'
  },
  'vi': {
    detailedHelp: 'Use `vi` to open the vim editor with the file provided. \n\
                    Within vi:\n\
                    i = enable edit mode\n\
                    : = enter command, `q` = quit, `wq` = write/save and quit\n\
                    Esc = exit current mode',
    generalHelp: 'Open the vim editor with the specified file'
  },
  'pwd':{
    detailedHelp: 'Use `pwd` to print current location',
    generalHelp: 'Print current location'
  },
  'ls': {
    detailedHelp: 'Use `ls` to list other files and directories.',
    generalHelp: 'List other files and directories.'
  },
  'rm': {
    detailedHelp: 'Use `rm` to destroy the file or directory specified.',
    generalHelp: 'Destroy the file or directory specified.'
  },
  'cd': {
    detailedHelp: 'Use `cd` to change directories.',
    generalHelp: 'Change directories.'
  },
  'cat': {
    detailedHelp: 'Use `cat` to print content of the specified file.',
    generalHelp: 'Print content of the specified file.'
  },
  'mkdir': {
    detailedHelp: 'Use `mkdir` to create a new directory with a specified path.',
    generalHelp: 'Create a new directory with a specified path.'
  },
  'touch': {
    detailedHelp: 'Use `touch` to create a new file with a specified path.',
    generalHelp: 'Create a new file with a specified path.'
  },
  'linkedin': {
    detailedHelp: 'Use `linkedin` to open collin\'s LinkedIn page in a new tab in your browser.',
    generalHelp: 'Open collin\'s LinkedIn page in a new tab in your browser.'
  }
};

export { commandDictionary };