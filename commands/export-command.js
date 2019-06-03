const dayjs = require('dayjs');
const pathModule = require('path');
const fs = require('fs');

const dataFile = require('../util/data-file');

function getWorkTime(begin, end) {
  let minutes = end.diff(begin, 'minute');
  if (minutes / 60 > 6) {
    minutes -= 30;
  }
  if (minutes / 60 > 9) {
    minutes -= 45;
  }
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

exports.attach = function attach(program) {
  program
    .command('export <path>')
    .option('-m, --month <m>', 'Month of data file to be exported. Defaults to current month')
    .option('-y, --year <y>', 'Year of data file to be exported. Defaults to current year')
    .description('Exports data file to .csv at specified location')
    .action((path, cmd) => {
      const currentDayJs = dayjs();
      let year = currentDayJs.year();
      let month = currentDayJs.month() + 1;

      if (cmd.month) {
        month = parseInt(cmd.month, 10);
      }
      if (cmd.year) {
        year = parseInt(cmd.year, 10);
      }

      const fileData = dataFile.read(month, year);
      const data = JSON.parse(fileData);
      let exportFileContents = '';

      if (data.length > 0) {
        const lastDayOfMonth = dayjs(data[0].begin).endOf('month').date();

        for (let i = 1; i <= lastDayOfMonth; i += 1) {
          const current = data.find(e => e.day === i);
          if (current) {
            const begin = dayjs(current.begin);
            const end = current.end ? dayjs(current.end) : null;

            exportFileContents += buildLine(begin, end);
          } else {
            exportFileContents += ',,,,\n';
          }
        }
      }

      const exportFileLocation = pathModule.join(path, `${dayjs().format('MM-YYYY')}.csv`);

      fs.writeFileSync(exportFileLocation, exportFileContents);
    });
};
