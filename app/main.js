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
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  LEFT_BRACE: "LEFT_BRACE",
  RIGHT_BRACE: "RIGHT_BRACE",
  COMMA: "COMMA",
  DOT: "DOT",
  MINUS: "MINUS",
  PLUS: "PLUS",
  SEMICOLON: "SEMICOLON",
  SLASH: "SLASH",
  STAR: "STAR",

  // One or two character tokens.
  BANG: "BANG",
  BANG_EQUAL: "BANG_EQUAL",
  EQUAL: "EQUAL",
  EQUAL_EQUAL: "EQUAL_EQUAL",
  GREATER: "GREATER",
  GREATER_EQUAL: "GREATER_EQUAL",
  LESS: "LESS",
  LESS_EQUAL: "LESS_EQUAL",

  // Literals.
  IDENTIFIER: "IDENTIFIER",
  STRING: "STRING",
  NUMBER: "NUMBER",

  // Keywords.
  AND: "AND",
  CLASS: "CLASS",
  ELSE: "ELSE",
  FALSE: "FALSE",
  FUN: "FUN",
  FOR: "FOR",
  IF: "IF",
  NIL: "NIL",
  OR: "OR",
  PRINT: "PRINT",
  RETURN: "RETURN",
  SUPER: "SUPER",
  THIS: "THIS",
  TRUE: "TRUE",
  VAR: "VAR",
  WHILE: "WHILE",

  EOF: "EOF"
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
      addToken(TokenType.LEFT_PAREN)
      break;
    case ')':
      addToken(TokenType.RIGHT_PAREN)
      break;
    case '{':
      addToken(TokenType.LEFT_BRACE)
      break;
    case '}':
      addToken(TokenType.RIGHT_BRACE)
      break;
    case '*':
      addToken(TokenType.STAR)
      break;
    case '.':
      addToken(TokenType.DOT)
      break;
    case ',':
      addToken(TokenType.COMMA)
      break;
    case '+':
      addToken(TokenType.PLUS)
      break;
    case '-':
      addToken(TokenType.MINUS)
      break;
    case ';':
      addToken(TokenType.SEMICOLON)
      break;
    case '=':
      match('=') ? addToken(TokenType.EQUAL_EQUAL) : addToken(TokenType.EQUAL);
      break;
    case '!':
      match('=') ? addToken(TokenType.BANG_EQUAL) : addToken(TokenType.BANG);
      break;
    case '<':
      match('=') ? addToken(TokenType.LESS_EQUAL) : addToken(TokenType.LESS);
      break;
    case '>':
      match('=') ? addToken(TokenType.GREATER_EQUAL) : addToken(TokenType.GREATER);
      break;
    case '/':
      if (match('/')) {
        while ((peek() !== '\n') && !isAtEnd()) { // peek without consuming the character, !match('\n') && !isAtEnd() would've worked as well
          advance();
        }
      } else {
        addToken(TokenType.SLASH)
      }
      break;
    case ' ':
    case '\r':
    case '\t':
      // Ignore whitespace.
      break;
    case '"':
      string();
      break
    case '\n':
      columnNumber = 0;
      ++line;
      break;
    default:
      if (isDigit(character)) {
        number();
      } else {
        error(line, undefined, `Unexpected character: ${character}`);
      }
      break;
  }
}

// TOKEN FACTORY
function createToken(type, lexeme, literal, lineNumber) {
  return {
    type,
    lexeme,
    literal,
    line: lineNumber,
    toString: function () {
      return `${type} ${lexeme} ${Number.isInteger(literal) ? literal + '.0' : literal}`
    }
  }
}

// js doesn't do method overloading :(
// function addToken(type) {
//   addToken(tokenType, null)
// }

// function addToken(type, literal) {
//   const text = fileContent.substring(start, current)
//   tokens.push(createToken(type, text, literal, line))
// }
function addToken(type, literal = null) {
  // in another language, this could be done with method overloading addToken...
  const lexeme = fileContent.substring(start, current);
  tokens.push(createToken(type, lexeme, literal, line));
}

// HELPERS
function isAtEnd() {
  return current >= fileContent.length;
}

function advance() {
  return fileContent[current++];
}

function string() {

  // while we're inside of quotations
  while (peek() !== '"' && !isAtEnd()) {
    if (peek() === '\n') {
      line++;
    }
    advance();
  }

  // quotation terminates early (reached eof)
  if (isAtEnd()) {
    start = current;
    error(line, undefined, 'Unterminated string.');
    return;
  }

  // consumes closing double quotes
  advance();

  // extracts content inside of quotations
  const value = fileContent.substring(start + 1, current - 1);
  addToken(TokenType.STRING, value);

}

function number() {
  while (isDigit(peek())) advance(); // consumes number

  // Look for fractional part
  if (peek() === '.' && isDigit(peekNext())) {
    // consume "." 
    advance();

    while (isDigit(peek())) advance();
  } 

  addToken(TokenType.NUMBER, parseFloat(fileContent.substring(start, current)));
}

function isDigit(c) {
  return '0' <= c && c <= '9';
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

function peekNext() {
  if (current + 1 >= fileContent.length) return '\0';
  return fileContent[++current]
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

  start = current;
  addToken(TokenType.EOF);
}
else {
  addToken(TokenType.EOF);
}

tokens.forEach(token => console.log(token.toString()));

if (hadError) {
  process.exit(65);
}