import { MINUS, PLUS, STAR, SLASH, OR, EQUAL, NOT_EQUAL } from "./TokenType";
import Environment from "./Environment";
import RuntimeException from "./exceptions/RuntimeException";
import Callable from "./Callable";

class Interpreter {
    constructor(expression, environment = new Environment()) {
        this.expression = expression;
        this.environment = environment;
    }

    async interpret() {
        return await this.evaluate(this.expression);
    }

    async evaluate(expression) {
        return await expression.accept(this);
    }

    async visitBinaryExpression(binaryExpression) {
        const left = await this.evaluate(binaryExpression.left);
        const right = await this.evaluate(binaryExpression.right);

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

    async visitUnaryExpression(unaryExpression) {
        const value = await this.evaluate(unaryExpression.right);

        if (unaryExpression.operator.type === MINUS) {
            this.checkNumberOperand(value);

            return -value;
        }

        return !this.isTruthy(value);
    }

    async visitLiteralExpression(literalExpression) {
        return Promise.resolve(literalExpression.value);
    }

    async visitGroupingExpression(groupingExpression) {
        return await this.evaluate(groupingExpression.expression);
    }

    async visitLogicalExpression(logicalExpression) {
        const left = await this.evaluate(logicalExpression.left);

        if (logicalExpression.operator.type == OR) {
            if (this.isTruthy(left)) {
                return left;
            }
        } else {
            if (!this.isTruthy(left)) {
                return left;
            }
        }

        return await this.evaluate(logicalExpression.right);
    }

    async visitVariableExpression(variableExpression) {
        return Promise.resolve(this.environment.get(variableExpression.token));
    }

    async visitCallExpression(callExpression) {
        const callee = await this.evaluate(callExpression.callee);
        const args = await Promise.all(callExpression.args.map(arg => this.evaluate(arg)));

        if (!(callee instanceof Callable)) {
            throw new RuntimeException(
                callExpression.closingParenthesis, 'Can only call functions.');
        }

        if (args.length != callee.arity()) {
            throw new RuntimeException(
                callExpression.closingParenthesis,
                `Expected ${callee.arity()} but got ${args.length} arguments.`);
        }

        return await callee.doCall(this, args);
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