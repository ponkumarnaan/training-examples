#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const WITH_FOLDER = "-wf";
const WITHOUT_FOLDER = "-Wf";
const ONLY_FILE = "-of";
var argument = process.argv.slice(2);
let commandName = "copy2";
let option  = null;
function optionFinder(arg) {
  // if (arg[0].indexOf("-") == 0){
  if (arg[0][0] == "-"){
    option = arg[0];
    arg.shift();
  }
}
function typeCheck (filePath) {
  if (fs.existsSync(filePath)) {
    if (fs.lstatSync(filePath).isDirectory()) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return -1;
  }
}
function copyFileToFile (fromPath,toPath) {
  fs.copyFileSync(fromPath,toPath);
}
function copyFileToFolder (dirPath,filePath) {
  fs.copyFileSync(filePath,path.join(dirPath,path.basename(filePath)));
}
function copyFolder(fromPath,toPath,option){
  let nextOption = null;
  let nextToPath = null;
  switch (option) {
    case WITHOUT_FOLDER:
      nextOption = (nextOption === null) ? WITH_FOLDER : nextOption;
      // nextToPath = (nextToPath === null) ? path.join(toPath,file) : nextToPath;
    case ONLY_FILE:
      nextOption = (nextOption === null) ? ONLY_FILE : nextOption;
      nextToPath = (nextToPath === null) ? toPath : nextToPath;
      let fileArray = fs.readdirSync(fromPath);
      fileArray.forEach( function (file)  {
        let nextFromPath = path.join(fromPath,file);
        if (fs.lstatSync(nextFromPath).isDirectory()) {
          copyFolder(nextFromPath,nextToPath,nextOption);
        } else {
          copyFileToFolder(toPath,nextFromPath);
        }
      })
      break;
    case WITH_FOLDER:
    default:
      nextToPath = path.join(toPath,path.basename(fromPath));
      if (fs.existsSync(nextToPath) == false) {
        fs.mkdirSync(nextToPath);
      }
      copyFolder(fromPath,nextToPath,WITHOUT_FOLDER);
  }
}
if (argument.includes("--help")) {
  console.log("");
  console.log("  Usage :");
  console.log("    c : copy file(s) (or) folder(s)");
  console.log("  Syntax :");
  console.log("      c [OPTION] SOURCE... DEST");
  console.log("  description:");
  console.log("    if the destination does not exists we create file (or) folder");
  console.log("  options :");
  console.log("    "+WITH_FOLDER+" :  we copy with source folder");
  console.log("    "+WITHOUT_FOLDER+" :  we copy without source folder");
  console.log("    "+ONLY_FILE+" :  we copy only source folder's files in single destination folder");

} else {
  switch (argument.length) {
    case 0:
      console.log(commandName+": missing file operand \n Try '"+commandName+" --help' for more information.  ");
      break;
    case 1:
      console.log(commandName+": missing destination file operand after '"+argument[0]+"' \n Try '"+commandName+" --help' for more information.  ");
      break;
    default:
      optionFinder(argument);
      let dirPath = path.resolve(argument.pop());
      let dirType = typeCheck(dirPath);
      switch (dirType) {
        case 1:
          argument.forEach(
            function (file)  {
              let filePath = path.resolve(file);
              switch (typeCheck(filePath)) {
                case 0:
                  copyFileToFolder(dirPath,filePath);
                  break;
                case 1:
                  copyFolder(filePath,dirPath,option);
                  break;
                case -1:
                default:
                  console.log(commandName+" : cannot stat '"+file+"': No such file or directory");
              }
            })
          break;
        case 0:
          if (argument.length == 1) {
            let firstFile = path.resolve(argument[0]);
            let firstFileType = typeCheck(firstFile);
            if (firstFileType == 0) {
              copyFileToFile (fromPath,dirPath);
            }else if (firstFileType == 1) {
              console.log(commandName+" : cannot do ");
            } else {
              console.log(commandName+" : cannot stat '"+argument[0]+"': No such file or directory");
            }
          } else {
            console.log("pleace check "+commandName+" --help ");
          }
          break;
        case -1:
          if (argument.length == 1) {
            let firstFile = path.resolve(argument[0]);
            let firstFileType  = typeCheck(firstFile);
            if (firstFileType == 1) {
              try {
                fs.mkdirSync(dirPath);
                copyFolder(firstFile,dirPath,option);
              } catch (e) {
                console.log(e);
                console.log(commandName+" : cannot create '"+dirPath+"':  directory");
              }
            }else if (firstFileType == 0) {
              copyFileToFile (fromPath,dirPath);
            } else {
              console.log(commandName+" : cannot stat '"+argument[0]+"': No such file or directory");
            }
          } else {
            console.log("pleace check "+commandName+" --help ");
          }
          break;
        default:
          console.log("pleace check "+commandName+" --help ");
      }
    }
  }

// }
