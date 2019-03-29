#!/usr/bin/env node

const program = require('commander');

const version = require('./package.json').version;

const beginCommand = require('./commands/begin-command');
const endCommand = require('./commands/end-command');
const configCommand = require('./commands/config-command');
const exportCommand = require('./commands/export-command');

program.version(version);

beginCommand.attach(program);
endCommand.attach(program);
configCommand.attach(program);
exportCommand.attach(program);

program
  .command('list [what]')
  .description('todo')
  .action(function (what, cmd) {
    console.log(`listing ${what}`);
  });

program.parse(process.argv);
