import { Directory } from "./directory.js"
import { File } from './file.js'

const bashProfile = new File({ name: '.bash_profile', content: 'BACKGROUND=black\nCOLOR=limegreen' })
const aboutFile = new File({ name: 'about.txt', content: 'Hi, I\'m Collin. Welcome to CollinOS.' });
const resumeFile = new File({ name: 'resume.txt', content: 'Done did some things.' });

const rootDir = new Directory({ path: '~', files: [bashProfile] });
const usersDir = new Directory({ path: '~/Users', parentDirectory: rootDir });

const guestDir = new Directory({ path: '~/Users/guest', parentDirectory: usersDir });
const welcomeDir = new Directory({ path: '~/Users/guest/welcome', files: [aboutFile], parentDirectory: guestDir });

const collinDir = new Directory({ path: '~/Users/collin', files: [resumeFile], parentDirectory: usersDir });
const projectsDir = new Directory({ path: '~/Users/collin/projects', parentDirectory: collinDir });

rootDir.directories = usersDir;
usersDir.directories = [collinDir, guestDir];
collinDir.directories = projectsDir;
guestDir.directories = welcomeDir;

export { rootDir, usersDir, guestDir, welcomeDir, collinDir, projectsDir }