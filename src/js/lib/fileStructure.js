import { Directory } from "./directory.js"

const rootDir = new Directory({ path: '~', files: ['.bash'] });
const usersDir = new Directory({ path: '~/Users', parentDirectory: rootDir });

const guestDir = new Directory({ path: '~/Users/guest', parentDirectory: usersDir });
const welcomeDir = new Directory({ path: '~/Users/guest/welcome', files: ['about.txt'], parentDirectory: guestDir });

const collinDir = new Directory({ path: '~/Users/collin', files: ['resume.txt', 'portfolio.txt'], parentDirectory: usersDir });
const projectsDir = new Directory({ path: '~/Users/collin/projects', files: ['project1.txt', 'secret-project.txt', 'hello.txt'], parentDirectory: collinDir });

rootDir.directories = usersDir;
usersDir.directories = [collinDir, guestDir];
collinDir.directories = projectsDir;
guestDir.directories = welcomeDir;

export { rootDir, usersDir, guestDir, welcomeDir, collinDir, projectsDir }