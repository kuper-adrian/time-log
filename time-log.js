#!/usr/bin/env node

const program = require('commander');
const dayjs = require('dayjs');

const fs = require('fs');
const path = require('path');

const version = require('./package.json').version;

const beginCommand = require('./commands/begin-command');
const endCommand = require('./commands/end-command');

program.version(version);

beginCommand.attach(program);
endCommand.attach(program);

program
  .command('config <name> <value>')
  .action(function (name, value, cmd) {
    console.log(`TODO: setting ${name} to ${value}`);
  });

program
  .command('export <p>')
  .description('todo')
  .action(function (p, cmd) {
    const fileData = fs.readFileSync(currentDataFilePath);
    const data = JSON.parse(fileData);
    let exportFileContents = '';

    data.forEach((entry) => {
      exportFileContents += `${dayjs(entry.begin).format('HH:mm')},${dayjs(entry.end).format('HH:mm')}\n`
    });
    const exportFileLocation = path.join(p, `${dayjs().format('MM-YYYY')}.csv`);

    fs.writeFileSync(exportFileLocation, exportFileContents);
  });

program
  .command('list [what]')
  .description('todo')
  .action(function (what, cmd) {
    console.log(`listing ${what}`);
  });

program.parse(process.argv);
