const dayjs = require('dayjs');
const dataFile = require('../util/data-file');

function listYears() {
  const years = dataFile.getDataFolderContents();
  years.forEach((element) => {
    console.log(element);
  });
}

function listMonths(year) {
  const months = dataFile.getYearFolderContents(year);
  months.forEach((element) => {
    console.log(element);
  });
}

function listDays(month, year) {
  const file = dataFile.read(month, year);
  const data = JSON.parse(file);

  data.forEach((element) => {
    let begin = null;
    let end = null;
    let hasDuration = false;

    if (element.begin) {
      begin = dayjs(element.begin);
    }

    if (element.end) {
      end = dayjs(element.end);
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

exports.attach = function attach(program) {
  program
    .command('list [what]')
    .option('-m, --month <m>', 'Month of data file to be exported. Defaults to current month')
    .option('-y, --year <y>', 'Year of data file to be exported. Defaults to current year')
    .description('Lists time logs')
    .action((what, cmd) => {
      const currentDayJs = dayjs();
      let year = null;
      let month = null;

      switch (what) {
        case 'years':
          listYears();
          break;

        case 'months':
          year = currentDayJs.year();

          if (cmd.year) {
            year = parseInt(cmd.year, 10);
          } else {
            year = dayjs().year();
          }

          listMonths(year);
          break;

        default:
          year = currentDayJs.year();
          month = currentDayJs.month() + 1;

          if (cmd.month) {
            month = parseInt(cmd.month, 10);
          }
          if (cmd.year) {
            year = parseInt(cmd.year, 10);
          }

          listDays(month, year);
          break;
      }
    });
};
