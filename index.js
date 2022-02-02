const argv = require("yargs").argv;
const fs = require("fs");
const readline = require("readline");

function ifFileExists(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile("array.txt", function (err, data) {
      if (err) {
        let content = fileName;
        content += "\n";
        fs.writeFile("array.txt", content, (error) => {
          if (error) {
            console.log("Error occured");
          }
          rl.close();
          resolve("created");
        });
      }

      if (data) {
        var array = data.toString().split("\n");
        let present = array.includes(fileName);
        if (present) {
          askForNewName(
            "File already exists, Please provide a new filename:=>"
          );
        } else {
          resolve(false);
        }
      }
    });
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askForNewName(message) {
  rl.question(message, (fileName) => {
    fs.readFile("array.txt", function (err, data) {
      if (err) {
        console.log("array.txt not found");
      }
      if (data) {
        var array = data.toString().split("\n");
        let present = array.includes(fileName);
        if (present) {
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
      .then((data) => {
        writeToFile(fileName, data);
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
