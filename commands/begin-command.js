const dayjs = require('dayjs');
const dataFile = require('../util/data-file');

exports.attach = function attach(program) {
  program
    .command('begin [time]')
    .option('-d, --day <d>', 'Day of month. Defaults to current day')
    .option('-m, --month <m>', 'Month. Defaults to current month')
    .option('-y, --year <y>', 'Year. Defaults to current year')
    .description('Sets start time')
    .action((time, cmd) => {
      const currentDayJs = dayjs();
      let year = currentDayJs.year();
      let month = currentDayJs.month() + 1;
      let day = currentDayJs.date();

      if (cmd.day) {
        day = parseInt(cmd.day, 10);
      }
      if (cmd.month) {
        month = parseInt(cmd.month, 10);
      }
      if (cmd.year) {
        year = parseInt(cmd.year, 10);
      }

      const fileData = dataFile.read(month, year);
      const data = JSON.parse(fileData);
      let entry = null;
      let entryIndex = -1;

      data.forEach((e, index) => {
        if (e.day === day) {
          entry = e;
          entryIndex = index;
        }
      });

      let begin = currentDayJs;

      if (time) {
        const timeRegex = /(\d{2}):(\d{2})/;
        const match = time.match(timeRegex);

        if (!match) {
          throw new Error('Invalid time. Please use format "HH:mm".');
        }

        begin = begin.set('hour', match[1]);
        begin = begin.set('minute', match[2]);
      }

      begin = begin.set('date', day);
      begin = begin.set('month', month - 1);
      begin = begin.set('year', year);
      begin = begin.set('second', 0);
      begin = begin.set('millisecond', 0);

      if (entry) {
        entry.begin = begin.format();
        data[entryIndex] = entry;
      } else {
        data.push({
          day,
          begin: begin.format(),
        });
      }

      data.sort((a, b) => a.day - b.day);
      dataFile.write(JSON.stringify(data, null, 2), month, year);
    });
};
