const argv = require("yargs").argv;
const fs = require("fs");
const readline = require("readline");

function ifFileExists(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile("array.txt", function (err, arrayData) {
      if (err) {
        if (err.code === "ENOENT") {
          handleWhenArrayFileNotFound(reject, resolve);
        } else {
          reject("file read error");
        }
      }

      if (arrayData) {
        handleWhenArrayExists(arrayData, resolve, fileName);
      }
    });
  });

  function handleWhenArrayFileNotFound(reject, resolve) {
    let content = fileName;
    content += "\n";
    fs.writeFile("array.txt", content, (error) => {
      if (error) {
        console.log("Error occured");
        reject("file write error");
      }
      rl.close();
      resolve("created");
    });
  }

  function handleWhenArrayExists(arrayData, resolve, fileName) {
    if (fileNamePresentInArray(arrayData, fileName)) {
      askForNewName("File already exists, Please provide a new filename:=>");
    } else {
      resolve("create file");
    }
  }
}

function fileNamePresentInArray(arrayData, fileName) {
  var array = arrayData.toString().split("\n");
  return array.includes(fileName);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout, 
});

function askForNewName(message) {
  rl.question(message, (fileName) => {
    fs.readFile("array.txt", function (err, arrayData) {
      if (err) {
        console.log("array.txt not found");
      }
      if (arrayData) {
        if (fileNamePresentInArray(arrayData, fileName)) {
          askForNewName(
            "File already exists, Please provide a new filename:=>"
          );
        } else {
          writeToFile(fileName);
          rl.close();
        }
      }
    });
  });
}

function askForUserInput(message) {
  rl.question(message, (fileName) => {
    ifFileExists(fileName)
      .then((res) => {
        writeToFile(fileName, res);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function writeToFile(fileName, data) {
  if (data !== "created") {
    let content = fileName;
    content += "\n";
    fs.appendFile("array.txt", content, (err) => {
      if (err) console.log(err);
    });
  }

  fs.writeFile(fileName, "You are awesome", (err) => {
    if (err) {
      console.log("Error occured");
    }
  });
}

if (argv._[0] == "write") {
  askForUserInput("Please provide the filename:=>");
} else {
  console.log("No write operation");
}
