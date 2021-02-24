import { Directory } from "./directory.js"
import { File } from './file.js'

const rootDir = new Directory({ path: '~' });
const usersDir = new Directory({ path: '~/Users', parentDirectory: rootDir });

const guestDir = new Directory({ path: '~/Users/guest', parentDirectory: usersDir });
const welcomeDir = new Directory({ path: '~/Users/guest/welcome', parentDirectory: guestDir });

const collinDir = new Directory({ path: '~/Users/collin', parentDirectory: usersDir });
const projectsDir = new Directory({ path: '~/Users/collin/projects', parentDirectory: collinDir });

const bashProfile = new File({ directory: rootDir, name: '.bash_profile', content: 'BACKGROUND=black\nCOLOR=limegreen' })
const aboutFile = new File({ directory: welcomeDir, name: 'about.txt', content: 'Hi, I\'m Collin. Welcome to CollinOS.' });
const resumeFile = new File({ directory: collinDir, name: 'resume.txt', content: 'Programmer, builder, tinkerer.' });

rootDir.directories = usersDir;
rootDir.files = bashProfile;
usersDir.directories = [collinDir, guestDir];
collinDir.directories = projectsDir;
collinDir.files = resumeFile;
guestDir.directories = welcomeDir;
welcomeDir.files = aboutFile;

export { rootDir, usersDir, guestDir, welcomeDir, collinDir, projectsDir }