import { MINUS, PLUS, STAR, SLASH, OR, EQUAL, NOT_EQUAL } from "./TokenType";
import Environment from "./Environment";
import RuntimeException from "./exceptions/RuntimeException";
import Callable from "./Callable";

class Interpreter {
    constructor(expression, environment = new Environment()) {
        this.expression = expression;
        this.environment = environment;
    }

    interpret() {
        return this.evaluate(this.expression);
    }

    evaluate(expression) {
        return expression.accept(this);
    }

    visitBinaryExpression(binaryExpression) {
        const left = this.evaluate(binaryExpression.left);
        const right = this.evaluate(binaryExpression.right);

        switch (binaryExpression.operator.type) {
            case MINUS:
                return left - right;
            case PLUS:
                return left + right;
            case STAR:
                this.checkNumberOperands(left, right);

                return left * right;
            case SLASH:
                this.checkNumberOperands(left, right);

                return left / right;
            case EQUAL:
                return this.isEqual(left, right);
            case NOT_EQUAL:
                return !this.isEqual(left, right);
        }
    }

    visitUnaryExpression(unaryExpression) {
        const value = this.evaluate(unaryExpression.right);

        if (unaryExpression.operator.type === MINUS) {
            this.checkNumberOperand(value);

            return -value;
        }

        return !this.isTruthy(value);
    }

    visitLiteralExpression(literalExpression) {
        return literalExpression.value;
    }

    visitGroupingExpression(groupingExpression) {
        return this.evaluate(groupingExpression.expression);
    }

    visitLogicalExpression(logicalExpression) {
        const left = this.evaluate(logicalExpression.left);

        if (logicalExpression.operator.type == OR) {
            if (this.isTruthy(left)) {
                return left;
            }
        } else {
            if (!this.isTruthy(left)) {
                return left;
            }
        }

        return this.evaluate(logicalExpression.right);
    }

    visitVariableExpression(variableExpression) {
        return this.environment.get(variableExpression.token);
    }

    visitCallExpression(callExpression) {
        const callee = this.evaluate(callExpression.callee);
        const args = callExpression.args.map(arg => this.evaluate(arg));

        if (!(callee instanceof Callable)) {
            throw new RuntimeException(
                callExpression.closingParenthesis, 'Can only call functions.');
        }

        if (args.length != callee.arity()) {
            throw new RuntimeException(
                callExpression.closingParenthesis,
                `Expected ${callee.arity()} but got ${args.length} arguments.`);
        }

        return callee.doCall(this, args);
    }

    checkNumberOperands(...operands) {
        for (const operand of operands) {
            this.checkNumberOperand(operand);
        }
    }

    checkNumberOperand(operand) {
        if (typeof operand !== 'number') {
            throw Error('Operand must be a number');
        }
    }

    isEqual(left, right) {
        if (typeof left !== typeof right) {
            return false;
        }

        return left == right;
    }

    isTruthy(value) {
        return !!value;
    }
}

export default Interpreter;