const dayjs = require('dayjs');
const dataFile = require('../util/data-file');

exports.attach = function attach(program) {
  program
    .command('end [time]')
    .option('-d, --day <d>', 'Day of month. Defaults to current day')
    .option('-m, --month <m>', 'Month. Defaults to current month')
    .option('-y, --year <y>', 'Year. Defaults to current year')
    .description('Sets end time')
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

      if (!entry) {
        throw new Error('No begin date');
      }

      let end = dayjs();
      if (time) {
        const timeRegex = /(\d{2}):(\d{2})/;
        const match = time.match(timeRegex);

        if (!match) {
          throw new Error('Invalid time. Please use format "HH:mm".');
        }

        end = end.set('hour', match[1]);
        end = end.set('minute', match[2]);
      }

      end = end.set('date', day);
      end = end.set('month', month - 1);
      end = end.set('year', year);
      end = end.set('second', 0);
      end = end.set('millisecond', 0);

      entry.end = end.format();
      data[entryIndex] = entry;


      dataFile.write(JSON.stringify(data, null, 2), month, year);
    });
};
