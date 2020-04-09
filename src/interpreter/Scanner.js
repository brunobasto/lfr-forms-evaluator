import * as TokenType from './TokenType';
import Token from './Token';
import isAlpha from './util/isAlpha';

const keywords = {
    "and": TokenType.AND,
    "AND": TokenType.AND,
    "false": TokenType.FALSE,
    "FALSE": TokenType.FALSE,
    "NOT": TokenType.NOT,
    "not": TokenType.NOT,
    "or": TokenType.OR,
    "OR": TokenType.OR,
    "true": TokenType.TRUE,
    "TRUE": TokenType.TRUE,
};
class Scanner {
    constructor(source) {
        this.source = source;

        this.keywords = {};
        this.tokens = [];

        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    addToken(type, literal = null) {
        const lexeme = this.source.substring(this.start, this.current);

        this.tokens.push(new Token(type, lexeme, literal, this.line));
    }

    advance() {
        this.current++;

        return this.source[this.current - 1];
    }

    isAlpha(char) {
        return isAlpha(char);
    }

    isAlphanumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }

    isDigit(char) {
        return /\d/.test(char);
    }

    match(expected) {
        if (this.isAtEnd()) {
            return false;
        }

        if (this.source[this.current] !== expected) {
            return false;
        }

        this.current++;

        return true;
    }

    peek() {
        if (this.isAtEnd()) {
            return '\0';
        }

        return this.source[this.current];
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) {
            return '\0';
        }

        return this.source[this.current + 1];
    }

    scanIdentifier() {
        console.log('space is alpha', this.isAlpha(' '));
        console.log('space is digit', this.isDigit(' '));

        while (this.isAlphanumeric(this.peek()) && !this.isAtEnd()) {
            this.advance();
        }

        const name = this.source.substring(this.start, this.current);
        const type = keywords[name] || TokenType.IDENTIFIER;

        this.addToken(type, name);
    }

    scanNumber() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }

        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            // Consume the dot character.
            this.advance();

            while (this.isDigit(this.peek())) {
                this.advance();
            }

            const value = parseFloat(this.source.substring(this.start, this.current), 10);

            this.addToken(TokenType.FLOAT, value)

            return;
        }

        const value = parseInt(this.source.substring(this.start, this.current), 10);

        this.addToken(TokenType.INTEGER, value);
    }

    scanString() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') {
                this.line++;
            }

            this.advance();
        }

        if (this.isAtEnd()) {
            throw new Error('Unterminated string literal.');
        }

        // If we got here we have a '"' so lets consume that.
        this.advance();

        const value = this.source.substring(this.start + 1, this.current - 1);

        this.addToken(TokenType.STRING, value);
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;

            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, null, null, this.line));

        return this.tokens;
    }

    scanToken() {
        const char = this.advance();

        switch (char) {
            case ',':
                this.addToken(TokenType.COMMA);
                break;
            case '[':
                this.addToken(TokenType.LEFT_BRACKET);
                break;
            case '[':
                this.addToken(TokenType.RIGHT_BRACKET);
                break;
            case '(':
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case '/':
                this.addToken(TokenType.SLASH);
                break;
            case '*':
                this.addToken(TokenType.STAR);
                break;
            case '=':
                this.match('=');
                this.addToken(TokenType.EQUAL);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '<':
                if (this.match('=')) {
                    this.addToken(TokenType.LESS_EQUAL);
                }
                else if (this.match('>')) {
                    this.addToken(TokenType.NOT_EQUAL);
                }
                else {
                    this.addToken(TokenType.LESS);
                }

                break;
            case '!':
                this.addToken(this.match('=') ? TokenType.NOT_EQUAL : TokenType.NOT);
                break;
            case '&':
                this.match('&');
                this.addToken(TokenType.AND);
                break;
            case '|':
                this.match('|');
                this.addToken(TokenType.OR);
                break;
            case '"':
                this.scanString();
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                line++;
                break;
            default:
                if (this.isDigit(char)) {
                    this.scanNumber();
                }
                else if (this.isAlpha(char)) {
                    this.scanIdentifier();
                }
                else {
                    throw new Error('Unexpected character.' + char)
                }

                break;
        }
    }
}

export default Scanner;