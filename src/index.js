import { CommandLine } from './lib/commandLine.js'

window.addEventListener('load', function() {
  new CommandLine(document.querySelector('#console'));
  setTitle();
});

function setTitle() {
  setInterval(() => {
    let split = document.title.split('');
    let lastLetter = split.pop();
    split.push(lastLetter === 'n' ? '_' : 'n')
    document.title = split.join('');
  }, 500);
}