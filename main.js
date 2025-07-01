#!/usr/bin/env node

import { dir } from "console";
import fs from "fs";
import promptUser from "prompt-sync";
import { program } from "commander";

const prompt = promptUser();

function cssContent(filename) {
  return `/* .${filename}{{

}} */`;
}
function jsxContent(filename) {
  return `import React from "react";
import ReactDOM from "react-dom";$
import './{filename}.css'
import PropTypes from 'prop-types';

function ${filename}({}) {{
  return (
    <div className="${filename}">
      <h3>${filename}</h3>
    </div>
  );
}}

${filename}.propTypes = {{
    // data: PropTypes.func.isRequired,
}};

export default ${filename};`;
}

function main() {
  console.log("Welcome to init components");
  let dirPath = "";
  while (true) {
    const nameQuest = prompt("Name of directory?[.]");
    dirPath =
      nameQuest === ""
        ? "./"
        : nameQuest.at(0) === "."
        ? nameQuest
        : "./" + nameQuest;
    if (!fs.existsSync(dirPath)) {
      console.log("Directory does not exist- try again");
    } else {
      break;
    }
  }
  // console.log(`Hello, ${name}!`);
  const cssQuest = prompt("Do you want to create a css file? [Y/n]");
  let css = false;
  if (cssQuest.toLowerCase() === "y" || cssQuest === "") {
    css = true;
  }
  let newFolderQuest = prompt("Do you want to create a new folder? [Y/n]");
  let newFolder = false;
  if (newFolderQuest.toLowerCase() === "y" || newFolderQuest === "") {
    newFolder = true;
  }
  console.log(
    `Directory: ${dirPath}   CSS: ${css}    New Folder: ${newFolder}`
  );

  while (true) {
    let newName = prompt('Name of component?(type "" or exit to exit) ');
    if (newName === "exit" || newName === "" || newName === '""') {
      break;
    }
    let finalPath = newName ? dirPath + "/" + newName : dirPath;
    if (newName === "") {
      console.log("Name cannot be empty");
      continue;
    } else if (fs.existsSync(finalPath) && newFolder) {
      console.log("Directory already exists. Try again");
      continue;
    }
    if (newFolder) {
      fs.mkdirSync(finalPath);
    }
    let newJsx = finalPath + "/" + newName + ".jsx";
    fs.writeFileSync(newJsx, jsxContent(newName));
    if (css) {
      let newCss = finalPath + "/" + newName + ".css";
      fs.writeFileSync(newCss, cssContent(newName));
    }
  }
}
program.name("react-comp-init").action((names, opts) => {
  main(); // Call the main function
});
program.parse();
