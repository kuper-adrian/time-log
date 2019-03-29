exports.attach = function(program) {
  program
    .command('list [what]')
    .description('todo')
    .action(function (what, cmd) {
      console.log(`listing ${what}`);
    });
}