#!/usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;

const beginCommand = require('./commands/begin-command');
const endCommand = require('./commands/end-command');
const configCommand = require('./commands/config-command');
const exportCommand = require('./commands/export-command');
const listCommand = require('./commands/list-command');

program.version(version);

beginCommand.attach(program);
endCommand.attach(program);
configCommand.attach(program);
exportCommand.attach(program);
listCommand.attach(program);

program.parse(process.argv);
