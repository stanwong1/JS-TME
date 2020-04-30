#!/usr/bin/env node

const Runner = require('./runner');
const runner = new Runner();

const run = async () => {
    //process cwd = current working directory 
    await runner.collectFiles(process.cwd());
    runner.runTest();
};

run(); 
