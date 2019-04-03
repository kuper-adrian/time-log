const dayjs = require('dayjs');
const dataFile = require('../util/data-file');
const path = require('path');
const fs = require('fs');

function getWorkTime(begin, end) {
  let minutes = end.diff(begin, 'minute');
  if (minutes / 60 > 6) {
    minutes -= 30;
  }
  if (minutes / 60 > 9) {
    minutes -= 45;
  }
  console.log(minutes);
  return minutes;
}

function getOvertime(workTime) {
  return Math.max(0, workTime - (60 * 8));
}

function getUndertime(workTime) {
  return Math.min(0, workTime - (60 * 8));
}

function buildLine(begin, end) {
  let line = '';

  line += `${begin.format('HH:mm')},`;

  if (end) {
    const workTimeInMinutes = getWorkTime(begin, end);
    const workTimeHours = workTimeInMinutes / 60;
    const overtime = getOvertime(workTimeInMinutes);
    const undertime = getUndertime(workTimeInMinutes);

    line += `${end.format('HH:mm')},`;
    line += `${workTimeHours},`;
    line += `${overtime ? (overtime / 60) : ''},`;
    line += `${undertime ? (undertime / 60) : ''}`;
  } else {
    line += ',,,';
  }
  
  line += '\n';

  return line;
}

exports.attach = function(program) {
  program
    .command('export <p>')
    .option('-m, --month <m>', 'Month of data file to be exported. Defaults to current month')
    .option('-y, --year <y>', 'Year of data file to be exported. Defaults to current year')
    .description('todo')
    .action(function (p, cmd) {
      const fileData = dataFile.read();
      const data = JSON.parse(fileData);
      let exportFileContents = '';

      const lastDayOfMonth = dayjs().endOf('month').date();

      for (let i = 1; i <= lastDayOfMonth; i++) {
        let current = data.find((e) => e.day == i);
        if (current) {
          const begin = dayjs(current.begin);
          const end = current.end ? dayjs(current.end) : null;
          

          exportFileContents += buildLine(begin, end);
        } else {
          exportFileContents += ',,,,\n'
        }
      }

      const exportFileLocation = path.join(p, `${dayjs().format('MM-YYYY')}.csv`);

      fs.writeFileSync(exportFileLocation, exportFileContents);
    });
}