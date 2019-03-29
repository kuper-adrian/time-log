exports.attach = function(program) {
  program
    .command('config <name> <value>')
    .action(function (name, value, cmd) {
      console.log(`TODO: setting ${name} to ${value}`);
    });
}