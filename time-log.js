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
  .command('begin [time]')
  .description('test')
  .action(function (time, cmd) {
    const fileData = fs.readFileSync(currentDataFilePath);
    const data = JSON.parse(fileData);
    const currentDay = dayjs().date();
    let entry = null;
    let entryIndex = -1;

    data.forEach((e, index) => {
      if (e.day === currentDay) {
        entry = e;
        entryIndex = index;
      } 
    });

    let begin = null;

    if (time) {
      const hour = parseInt(time.substring(0, 2));
      const minute = parseInt(time.substring(3, 5));
      begin = dayjs();
      begin = begin.set('hour', hour);
      begin = begin.set('minute', minute);
    } else {
      begin = dayjs();
    }

    if (entry) {
      entry.begin = begin.format();
      data[entryIndex] = entry;
    } else {
      data.push({
        day: currentDay,
        begin: begin.format(),
      });
    }

    fs.writeFileSync(currentDataFilePath, JSON.stringify(data));
  });

program
  .command('end [time]')
  .action(function (time, cmd) {
    const fileData = fs.readFileSync(currentDataFilePath);
    const data = JSON.parse(fileData);
    const currentDay = dayjs().date();
    let entry = null;
    let entryIndex = -1;

    data.forEach((e, index) => {
      if (e.day === currentDay) {
        entry = e;
        entryIndex = index;
      } 
    })

    if (!entry) {
      throw new Error('No begin date');
    }

    if (time) {
      // TODO replace with regex
      const hour = parseInt(time.substring(0, 2));
      const minute = parseInt(time.substring(3, 5));
      let end = dayjs();
      end = end.set('hour', hour);
      end = end.set('minute', minute);
      entry.end = end.format();
    } else {
      entry.end = dayjs().format();
    }
    
    data[entryIndex] = entry;

    fs.writeFileSync(currentDataFilePath, JSON.stringify(data));
  });

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

function init() {
  if (!fs.existsSync(config.data)) {
    fs.mkdirSync(config.data);
  }

  const currentMonth = dayjs().format('MM');
  const currentYear = dayjs().year().toString();
  
  const currentYearFolderPath = path.join(config.data, currentYear);
  if (!fs.existsSync(currentYearFolderPath)) {
    fs.mkdirSync(currentYearFolderPath)
  }

  currentDataFilePath = path.join(currentYearFolderPath, `${currentMonth}-${currentYear}.json`);
  if (!fs.existsSync(currentDataFilePath)) {
    fs.writeFileSync(currentDataFilePath, '[]');
  }
}