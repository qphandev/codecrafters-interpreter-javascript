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

function scanToken(character) {
  // Exit 65
  let isError65 = false;

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
      peekAndMatch('=') ? console.log('EQUAL_EQUAL == null') : console.log('EQUAL = null');
      break;
    case '\n':
      ++line;
      break;
    default:
      console.error(`[line ${line}] Error: Unexpected character: ${character}`);
      isError65 = true;
  }

  tokens.push(TokenType.EOF);

  if (isError65) {
    process.exit(65);
  }
}

// HELPERS
function isAtEnd() {
  return current >= fileContent.length;
}

function advance() {
  return fileContent[current++];
}

function peekAndMatch(expected) {
  if (isAtEnd()) return false;
  if (fileContent[current] !== expected) return false;

  ++current;
  return true;
}

// BEGIN READING FILE
if (fileContent.length !== 0) {

  while (!isAtEnd()) {
    start = current;
    const character = advance();
    
    scanToken(character);
  }
  console.log("EOF  null");
}
else {
  console.log("EOF  null");
}