const dayjs = require('dayjs');
const dataFile = require('../util/data-file');
const path = require('path');
const fs = require('fs');

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
          exportFileContents += `${dayjs(current.begin).format('HH:mm')},${dayjs(current.end).format('HH:mm')}\n`
        } else {
          exportFileContents += ',\n'
        }
      }

      const exportFileLocation = path.join(p, `${dayjs().format('MM-YYYY')}.csv`);

      fs.writeFileSync(exportFileLocation, exportFileContents);
    });
}