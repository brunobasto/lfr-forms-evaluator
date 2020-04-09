import * as TokenType from './TokenType';
import Expression from './Expression';

class Parser {
    constructor(tokens) {
        this.tokens = tokens;

        this.current = 0;
    }

    parse() {
        return this.parseExpression();
    }

    /*
     * Grammar: expression = equality;
     */

    parseExpression() {
        return this.parseLogicOr();
    }

    /*
     * Grammar: logic_or = logic_and ( "or" logic_and )*;
     */

    parseLogicOr() {
        let left = this.parseLogicAnd();

        while (this.match(TokenType.OR)) {
            const operator = this.previous();
            const right = this.parseLogicAnd();

            left = new Expression.Logical(left, operator, right);
        }

        return left;
    }

    /*
     * Grammar: logic_and = equality ( "and" equality )*;
     */

    parseLogicAnd() {
        let left = this.parseEquality();

        while (this.match(TokenType.AND)) {
            const operator = this.previous();
            const right = this.parseEquality();

            left = new Expression.Logical(left, operator, right);
        }

        return left;
    }

    /*
     * Grammar: equality = comparison ( ( "==" | "!=" ) comparison )*;
     */

    parseEquality() {
        let left = this.parseComparison();

        while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
            const operator = this.previous();
            const right = this.parseComparison();

            left = new Expression.Binary(left, operator, right);
        }

        return left;
    }

    /*
     * Grammar: comparison = addition ( ( ">" | ">=" | "<" | "<=" ) addition )*;
     */

    parseComparison() {
        let left = this.parseAddition();

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.parseAddition();

            left = new Expression.Binary(left, operator, right);
        }

        return left;
    }

    /*
     * Grammar: addition = multiplication ( ("-" | "+") multiplication )*;
     */

    parseAddition() {
        let left = this.parseMultiplication();

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator = this.previous();
            const right = this.parseMultiplication();

            left = new Expression.Binary(left, operator, right);
        }

        return left;
    }

    /*
     * Grammar: multiplication = unary ( ("/" | "*") unary )*;
     */

    parseMultiplication() {
        let left = this.parseUnary();

        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator = this.previous();
            const right = this.parseUnary();

            left = new Expression.Binary(left, operator, right);
        }

        return left;
    }

    /*
     * Grammar: unary = ("-" | "!") unary | call;
     */

    parseUnary() {
        if (this.match(TokenType.MINUS, TokenType.NOT)) {
            const operator = this.previous();
            const right = this.parseUnary();

            return new Expression.Unary(operator, right);
        }

        return this.parseCall();
    }

    /*
     * Grammar: call  → primary ( "(" arguments? ")" )* ;
     */

    parseCall() {
        let expression = this.parsePrimary();

        while (true) {
            if (this.match(TokenType.LEFT_PAREN)) {
                expression = this.finishCall(expression);
            }
            else {
                break;
            }
        }

        return expression;
    }

    finishCall(callee) {
        const args = [];

        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                args.push(this.parseExpression());
            } while (this.match(TokenType.COMMA));
        }

        const closingParenthesis = this.consume(
            TokenType.RIGHT_PAREN,
            'Closing parenthesis ( ")" ) expected after function arguments.');
        
        return new Expression.Call(callee, args, closingParenthesis);
    }

    /*
     * Grammar: primary = NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" | IDENTIFIER;
     */

    parsePrimary() {
        const token = this.peek();

        switch (token.type) {
            case TokenType.FALSE:
                this.advance();

                return new Expression.Literal(false);
            case TokenType.TRUE:
                this.advance();

                return new Expression.Literal(true);
            case TokenType.INTEGER:
            case TokenType.FLOAT:
            case TokenType.STRING:
                this.advance();

                return new Expression.Literal(token.literal);
            case TokenType.IDENTIFIER:
                this.advance();

                return new Expression.Variable(token);
            default:
                if (this.match(TokenType.LEFT_PAREN)) {
                    const expression = this.parseExpression();

                    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression.");

                    return new Expression.Grouping(expression);
                }
        }

        throw new Error("Expected expression." + this.peek());
    }

    /*
     * Utility methods
     */

    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }

        return this.previous();
    }

    check(type) {
        if (this.isAtEnd()) {
            return false;
        }

        return this.peek().type === type;
    }

    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }

        throw new Error(message + this.peek());
    }

    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    match(...types) {
        for (let i = 0; i < types.length; i++) {
            if (this.check(types[i])) {
                this.advance();

                return true;
            }
        }

        return false;
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }
}

export default Parser;