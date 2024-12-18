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

const TokenType = {
  // Single-character tokens.
  LEFT_PAREN: { name: "LEFT_PAREN", lexeme: "(" },
  RIGHT_PAREN: { name: "RIGHT_PAREN", lexeme: ")" },
  LEFT_BRACE: { name: "LEFT_BRACE", lexeme: "{" },
  RIGHT_BRACE: { name: "RIGHT_BRACE", lexeme: "}" },
  COMMA: { name: "COMMA", lexeme: "," },
  DOT: { name: "DOT", lexeme: "." },
  MINUS: { name: "MINUS", lexeme: "-" },
  PLUS: { name: "PLUS", lexeme: "+" },
  SEMICOLON: { name: "SEMICOLON", lexeme: ";" },
  SLASH: { name: "SLASH", lexeme: "/" },
  STAR: { name: "STAR", lexeme: "*" },

  // One or two character tokens.
  BANG: { name: "BANG", lexeme: "!" },
  BANG_EQUAL: { name: "BANG_EQUAL", lexeme: "!=" },
  EQUAL: { name: "EQUAL", lexeme: "=" },
  EQUAL_EQUAL: { name: "EQUAL_EQUAL", lexeme: "==" },
  GREATER: { name: "GREATER", lexeme: ">" },
  GREATER_EQUAL: { name: "GREATER_EQUAL", lexeme: ">=" },
  LESS: { name: "LESS", lexeme: "<" },
  LESS_EQUAL: { name: "LESS_EQUAL", lexeme: "<=" },

  // Literals.
  IDENTIFIER: { name: "IDENTIFIER", lexeme: "" },
  STRING: { name: "STRING", lexeme: "" },
  NUMBER: { name: "NUMBER", lexeme: "" },

  // Keywords.
  AND: { name: "AND", lexeme: "and" },
  CLASS: { name: "CLASS", lexeme: "class" },
  ELSE: { name: "ELSE", lexeme: "else" },
  FALSE: { name: "FALSE", lexeme: "false" },
  FUN: { name: "FUN", lexeme: "fun" },
  FOR: { name: "FOR", lexeme: "for" },
  IF: { name: "IF", lexeme: "if" },
  NIL: { name: "NIL", lexeme: "nil" },
  OR: { name: "OR", lexeme: "or" },
  PRINT: { name: "PRINT", lexeme: "print" },
  RETURN: { name: "RETURN", lexeme: "return" },
  SUPER: { name: "SUPER", lexeme: "super" },
  THIS: { name: "THIS", lexeme: "this" },
  TRUE: { name: "TRUE", lexeme: "true" },
  VAR: { name: "VAR", lexeme: "var" },
  WHILE: { name: "WHILE", lexeme: "while" },

  EOF: { name: "EOF", lexeme: "" }
};

const tokens = [];
let start = 0;
let current = 0;
let line = 1;
let columnNumber = 0;

let hadError = false;

function scanToken(character) {
  switch (character) {
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
    case '=':
      match('=') ? console.log('EQUAL_EQUAL == null') : console.log('EQUAL = null');
      break;
    case '!':
      match('=') ? console.log('BANG_EQUAL != null') : console.log('BANG ! null');
      break;
    case '<':
      match('=') ? console.log('LESS_EQUAL <= null') : console.log('LESS < null');
      break;
    case '>':
      match('=') ? console.log('GREATER_EQUAL >= null') : console.log('GREATER > null');
      break;
    case '/':
      if (match('/')) {
        while ((peek() !== '\n') && !isAtEnd()) { // peek without consuming the character, !match('\n') && !isAtEnd() would've worked as well
          advance();
        }
      } else {
        console.log('SLASH / null');
      }
      break;
    case ' ':
    case '\r':
    case '\t':
      // Ignore whitespace.
      break;
    case '\n':
      columnNumber = 0;
      ++line;
      break;
    default:
      // console.error(`[line ${line}] Error: Unexpected character: ${character}`);
      error(line, undefined, `Unexpected character: ${character}`);
  }

  tokens.push(TokenType.EOF);
}

// HELPERS
function isAtEnd() {
  return current >= fileContent.length;
}

function advance() {
  return fileContent[current++];
}

/**
 * Checks if the current character in the file content matches the expected character.
 * 
 * @param {string} expected - The character to match against the current character in the file content.
 * @return {boolean} - Returns true if the current character matches the expected character and advances the current position, otherwise returns false.
 */
function match(expected) {
  if (isAtEnd()) return false;
  if (fileContent[current] !== expected) return false;

  ++current;
  return true;
}

/**
 * 
 * @returns {string} - Returns the current character in the file content.
 */
function peek() {
  if (isAtEnd()) return '\0';
  return fileContent[current];
}

function error(line, columnNumber, message) {
  report(line, columnNumber, "", message);
}

function report(line, columnNumber, where, message) {
  console.error(`[line ${line}] Error: ${message}`);
  hadError = true;
}

// BEGIN READING FILE
if (fileContent.length !== 0) {

  while (!isAtEnd()) {
    start = current;
    const character = advance();

    scanToken(character);
  }
  console.log("EOF  null");

  if (hadError) {
    process.exit(65);
  }
}
else {
  console.log("EOF  null");
}