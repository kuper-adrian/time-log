exports.attach = function attach(program) {
  program
    .command('config <name> <value>')
    .action((name, value) => {
      console.log(`TODO: setting ${name} to ${value}`);
    });
};
