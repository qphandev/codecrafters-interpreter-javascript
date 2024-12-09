import fs from "fs";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!");

const filename = args[1];

// Uncomment this block to pass the first stage

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {

  // Exit 65
  let isError65 = false;

  let lineCounter = 1;
  // break apart 
  let i = 0;
  while (i < fileContent.length) {
    const c = fileContent[i];
    switch (c) {
      case '(':
        console.log('LEFT_PAREN ( null');
        break;
      case ')':
        console.log('RIGHT_PAREN ) null');
        break;
      case '{':
        console.log('LEFT_BRACE { null');
        break;
      case '}':
        console.log('RIGHT_BRACE } null');
        break;
      case '*':
        console.log('STAR * null');
        break;
      case '.':
        console.log('DOT . null');
        break;
      case ',':
        console.log('COMMA , null');
        break;
      case '+':
        console.log('PLUS + null');
        break;
      case '-':
        console.log('MINUS - null');
        break;
      case ';':
        console.log('SEMICOLON ; null');
        break;
      case '$':
        console.error(`[line ${lineCounter}] Error: Unexpected character: $`);
        isError65 = true;
        break;
      case '#':
        console.error(`[line ${lineCounter}] Error: Unexpected character: #`);
        isError65 = true;
        break;
      case '\n':
        ++lineCounter;
        break;
      default:
        isError65 = true;
    }
    ++i;
  }
  console.log("EOF  null");

  if (isError65) {
    process.exit(65);
  }
}
else {
  console.log("EOF  null");
}