#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
var argument = process.argv.slice(2);
let commandName = "m";
if (argument.includes("--help")) {
  console.log(
   " Usage: "+commandName+" [OPTION]... [-T] SOURCE DEST \n or:   [OPTION]... SOURCE... DIRECTORY \n or:  "+commandName+" [OPTION]... -t DIRECTORY SOURCE... \n Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.");
} else {
  switch (argument.length) {
    case 0:
      console.log(commandName+": missing file operand \n Try '"+commandName+" --help' for more information.  ");
      break;
    case 1:
      console.log(commandName+": missing destination file operand after '"+argument[0]+"' \n Try '"+commandName+" --help' for more information.  ");
      break;
    default:
      let dirName = path.resolve(argument.pop());
      let temPath = null;
      if ( fs.existsSync(dirName) && fs.lstatSync(dirName).isDirectory()) {
        argument.forEach((file) => {
          temPath = path.resolve(file);
          try {
            if (fs.existsSync(temPath)) {
              fs.renameSync(temPath,path.join(dirName,path.basename(temPath)));
            } else {
              throw new Error();
            }
          } catch (e) {
            console.log(commandName+" : cannot stat '"+file+"': No such file or directory");
          }
        })
      } else if (argument.length == 2) {
        try {
          temPath = path.resolve(argument[0]);
          let fileType = ["isFile","isDirectory","isCharacterDevice","isSymbolicLink","isFIFO","isSocket"];
          let checkCondition = () => fileType.reduce(
            (prev,functionName) => (prev || [temPath,dirName].reduce(
              (condi,ele) => (condi || fs.lstatSync(ele)[functionName]()),
              false
            ) ,
            false
          ));
          if (fs.existsSync(temPath)) {
            console.log("mpmpm "+(fs.existsSync(dirName) == false));
            if ((fs.existsSync(dirName) == false) || checkCondition()) {
              fs.renameSync(temPath,dirName);
            } else {
              throw new Error();
            }
          } else {
            throw new Error();
          }
        } catch (e) {
          console.log(commandName+" : cannot stat '"+argument[0]+"': No such file or directory");
        }
    }
  }
}
