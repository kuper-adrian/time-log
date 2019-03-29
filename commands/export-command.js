const dayjs = require('dayjs');
const dataFile = require('../util/data-file');
const path = require('path');
const fs = require('fs');

exports.attach = function(program) {
  program
    .command('export <p>')
    .description('todo')
    .action(function (p, cmd) {
      const fileData = dataFile.read();
      const data = JSON.parse(fileData);
      let exportFileContents = '';

      data.forEach((entry) => {
        exportFileContents += `${dayjs(entry.begin).format('HH:mm')},${dayjs(entry.end).format('HH:mm')}\n`
      });
      const exportFileLocation = path.join(p, `${dayjs().format('MM-YYYY')}.csv`);

      fs.writeFileSync(exportFileLocation, exportFileContents);
    });
}