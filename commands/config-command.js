const fs = require('fs');
const path = require('path');

const CONFIG_FILE_NAME = '../time-log.config.json';

exports.attach = function attach(program) {
  program
    .command('config <name> <value>')
    .action((name, value) => {
      const configFilePath = path.join(__dirname, CONFIG_FILE_NAME);
      const configData = fs.readFileSync(configFilePath);
      const config = JSON.parse(configData);

      config[name] = value;
      fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    });
};
