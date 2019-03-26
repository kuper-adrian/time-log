#!/usr/bin/env node

const program = require('commander');
const dayjs = require('dayjs');

const fs = require('fs');
const path = require('path');

const version = require('./package.json').version;
const config = require('./time-log.config.json');

let currentDataFilePath;

program.version(version);

init();

program
  .command('begin')
  .action(function (cmd) {
    const fileData = fs.readFileSync(currentDataFilePath);
    const data = JSON.parse(fileData);
    const currentDay = dayjs().day();
    let entry = null;
    let entryIndex = -1;

    data.forEach((e, index) => {
      if (e.day === currentDay) {
        entry = e;
        entryIndex = index;
      } 
    })

    if (entry) {
      entry.start = dayjs().format();
      data[entryIndex] = entry;
    } else {
      data.push({
        day: currentDay,
        start: dayjs().format(),
      });
    }

    fs.writeFileSync(currentDataFilePath, JSON.stringify(data))
  });

program
  .command('end')
  .action(function (cmd) {
    console.log('todo')
  });

program
  .command('config <name> <value>')
  .action(function (name, value, cmd) {
    console.log(`TODO: setting ${name} to ${value}`);
  });

program.parse(process.argv);

function init() {
  if (!fs.existsSync(config.data)) {
    fs.mkdirSync(config.data);
  }
  const currentMonth = dayjs().format('MM-YYYY');
  
  currentDataFilePath = path.join(config.data, `${currentMonth}.json`);
  if (!fs.existsSync(currentDataFilePath)) {
    fs.writeFileSync(currentDataFilePath, '[]');
  }
}