import { CommandLine } from './lib/commandLine.js'

window.addEventListener('load', function() {
  var consoleEl = document.querySelector('#console')
  consoleEl.addEventListener('click', function() {
    document.querySelector('#hidden-input').focus();
  })
  consoleEl.click();
  new CommandLine(consoleEl);
});