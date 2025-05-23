const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const languageToExtension = {
  python: "py",
  javascript: "js",
  java: "java",
  cpp: "cpp",
  c: "c",
};

const languageToFolder = {
  python: "python",
  javascript: "javascript",
  java: "java",
  cpp: "cpp",
  c: "c",
};

const runCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    try {
      const folderName = languageToFolder[language.toLowerCase()];
      if (!folderName) {
        return reject("Unsupported language");
      }

      const tempDir = path.join(__dirname, "..", "temp", folderName);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const fileExtension = languageToExtension[language.toLowerCase()];
      const filePath = path.join(tempDir, `temp.${fileExtension}`);

      // Step 1: Write the code to the file
      fs.writeFileSync(filePath, code, "utf-8");

      let command = "";
      let args = [];

      // Step 2: Set the appropriate compile/run command based on the language
      switch (language.toLowerCase()) {
        case "python":
          command = "python";
          args = [filePath];
          break;
        case "javascript":
          command = "node";
          args = [filePath];
          break;
        case "java":
          command = "javac";
          args = [filePath];
          break;
        case "cpp":
          command = "g++";
          args = [filePath, "-o", path.join(tempDir, "temp.exe")];
          break;
        case "c":
          command = "gcc";
          args = [filePath, "-o", path.join(tempDir, "temp.exe")];
          break;
        default:
          return reject("Unsupported language");
      }

      // Step 3: Compile the code (if necessary)
      const compileProcess = spawn(command, args);

      compileProcess.on("close", (compileCode) => {
        if (compileCode !== 0) {
          return reject("Compilation error");
        }

        // Step 4: Run the executable after successful compilation (or directly run if no compilation needed)
        let runCommand;
        let runArgs = [];

        if (language === "java") {
          runCommand = "java";
          runArgs = ["-cp", tempDir, "temp"];
        } else if (language === "cpp" || language === "c") {
          runCommand = path.join(tempDir, "temp.exe");
          runArgs = [];
        } else {
          runCommand = command;
          runArgs = args;
        }

        const runProcess = spawn(runCommand, runArgs);

        // Step 5: Handle inputs if provided
        if (input) {
          runProcess.stdin.write(input + "\n"); // Write input and simulate pressing "Enter"
          runProcess.stdin.end(); // End the input stream to signal no more input
        }

        let output = "";
        let errorOutput = "";

        // Step 6: Capture stdout and stderr
        runProcess.stdout.on("data", (data) => {
          output += data.toString();
        });

        runProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        // Step 7: Return the result after process execution
        runProcess.on("close", (runCode) => {
          if (runCode !== 0) {
            return reject(errorOutput || "Runtime error");
          }
          resolve(output); // Resolve with the output of the execution
        });
      });
    } catch (err) {
      reject(err.message); // If any unexpected errors occur
    }
  });
};

module.exports = { runCode };
