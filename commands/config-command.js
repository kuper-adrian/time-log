const fs = require('fs');
const path = require('path');

const CONFIG_FILE_NAME = '../time-log.config.json';

exports.attach = function attach(program) {
  program
    .command('config [name] [value]')
    .option('-l, --list', 'List current config')
    .action((name, value, cmd) => {
      const configFilePath = path.join(__dirname, CONFIG_FILE_NAME);
      const configData = fs.readFileSync(configFilePath);
      const config = JSON.parse(configData);

      if (name && value) {
        config[name] = value;
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
      }
      if (cmd.list) {
        console.log(JSON.stringify(config, null, 2));
      }
    });
};
