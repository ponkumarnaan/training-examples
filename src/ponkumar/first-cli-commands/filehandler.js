#!/usr/bin/env node
const spawnSync = require('child_process').spawnSync;
var argument = process.argv.slice(3);
switch (process.argv[2]) {
  case "-ls":
    spawnSync("ls",argument,{"stdio":"inherit"})
    break;
  case "-mv":
    spawnSync("mv",argument,{"stdio":"inherit"})
    break;
  case "-cp":
    spawnSync("cp",argument,{"stdio":"inherit"})
    break;
  case "--help":
    console.log(` filehandler -ls : act like ls
 filehandler -mv : act like mv
 filehandler -cp : act like cp`);
    break;
  default:
    console.log(`pleace check  filehandler --help `);
}
