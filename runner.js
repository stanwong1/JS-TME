const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const render = require('./render');

//files we want to ignore
const forbiddenDirs = ['node_modules']

class Runner {
    //data structure to store a reference for every test file - (constructor)
    constructor() {
        this.testFiles = [];
    }

    async runTest() {
        for (let file of this.testFiles) {
            console.log(chalk.gray(`---- ${file.shortName}`));
            console.log(`${file.shortName}`)
            const beforeEaches = [];
            global.render = render;
            global.beforeEach = (fn) => {
                beforeEaches.push(fn);
            };
            //finds file then runs everything inside ---- use global variable for it due to the beforeEach()
            global.it = async (desc, fn) => {
                beforeEaches.forEach(func => func());
                try {
                    await fn();
                    console.log(chalk.green(`\tOK - ${desc}`));
                } catch (err) {
                    //indention for terminal
                    const message = err.message.replace(/\n/g, '\n\t\t')
                    console.log(chalk.red(`\tX - ${desc}`));
                    //'\t' is a tab for the terminal
                    console.log(chalk.red('\t', message));
                }
            };

            try {
                require(file.name);
            } catch (err) {
                console.log(chalk.red('X - Error Loading File', file.name));
                console.log(chalk.red(err));
            }
        }
    }

    async collectFiles(targetPath) {
        //targetPath === /users/stanwong/desktop/projects/movies (EXAMPLE)
        const files = await fs.promises.readdir(targetPath);

        for (let file of files) {
            const filepath = path.join(targetPath, file);
            const stats = await fs.promises.lstat(filepath);

            if (stats.isFile() && file.includes('.test.js')) {
                this.testFiles.push({ name: filepath, shortName: file });
            } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
                const childFiles = await fs.promises.readdir(filepath);
                
                //take everything out of childfiles and add individually into files array
                files.push(...childFiles.map(f => path.join(file, f)));
            }
        }
    }
}

module.exports = Runner;