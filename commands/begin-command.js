const dayjs = require('dayjs');
const dataFile = require('../util/data-file');

exports.attach = function(program) {
  program
    .command('begin [time]')
    .description('todo')
    .action(function (time, cmd) {
      const fileData = dataFile.read();
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

      dataFile.write(JSON.stringify(data));
    });
}