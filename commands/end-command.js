const dayjs = require('dayjs');
const dataFile = require('../util/data-file');

exports.attach = function(program) {
  program
    .command('end [time]')
    .description('todo')
    .action(function(time, cmd) {
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

      dataFile.write(JSON.stringify(data));
    });
}