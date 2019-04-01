const dayjs = require('dayjs');
const dataFile = require('../util/data-file');

function listYears() {
  const years = dataFile.getDataFolderContents();
  years.forEach(element => {
    console.log(element);
  });
}

function listMonths(year) {
  const months = dataFile.getYearFolderContents(year);
  months.forEach(element => {
    console.log(element);
  });
}

function listDays(month, year) {
  const file = dataFile.read(month, year);
  const data = JSON.parse(file);

  data.forEach(element => {
    let begin = null;
    let end = null;
    let hasDuration = false;

    if (element.begin) {
      begin = dayjs(element.begin);
    }

    if (element.end) {
      end = end = dayjs(element.end);
      hasDuration = true;
    }
    let duration = null;

    if (hasDuration) {
      duration = end.diff(begin, 'hour');
    }

    let listing = `Day: ${element.day}, `;
    listing += `Begin: ${begin ? begin.format('HH:mm') : '-'}, `;
    listing += `End: ${end ? end.format('HH:mm') : '-'}, `;
    listing += `Duration: ${duration != null ? duration : '-'}h`;

    console.log(listing);
  });
}

exports.attach = function(program) {
  program
    .command('list [what]')
    .option('-m, --month <m>', 'Month of data file to be exported. Defaults to current month')
    .option('-y, --year <y>', 'Year of data file to be exported. Defaults to current year')
    .description('todo')
    .action(function (what, cmd) {
      let year = null;
      let month = null;

      switch (what) {
        case 'years':
          listYears();
          break;

        case 'months':
          if (cmd.year) {
            year = cmd.year;
          } else {
            year = dayjs().year();
          }
          
          listMonths(year);
          break;

        default:
          if (cmd.year) {
            year = cmd.year;
          } else {
            year = dayjs().year();
          }
          if (cmd.month) {
            month = cmd.month;
          } else {
            month = dayjs().month() + 1;
          }
          listDays(month, year);
          break;
      }
    });
}