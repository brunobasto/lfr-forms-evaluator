import {asTree} from 'treeify';

class ASTPrinter {
    constructor(expression) {
        this.expression = expression;
    }

    async evaluate(expression) {
        return await expression.accept(this);
    }

    async print() {
        return asTree(await this.expression.accept(this), true);
    }

    async visitBinaryExpression(binaryExpression) {
        const left = await this.evaluate(binaryExpression.left);
        const right = await this.evaluate(binaryExpression.right);
        const operator = binaryExpression.operator;

        return {[operator]: {left, right}};
    }

    async visitUnaryExpression(unaryExpression) {
        const right = await this.evaluate(unaryExpression.right);
        const operator = unaryExpression.operator;

        return {[operator]: {right}};
    }

    async visitLiteralExpression(literalExpression) {
        return Promise.resolve(literalExpression.value);
    }

    async visitGroupingExpression(groupingExpression) {
        return await this.evaluate(groupingExpression.expression);
    }

    async visitLogicalExpression(logicalExpression) {
        return await this.visitBinaryExpression(logicalExpression);
    }
    
    async visitVariableExpression(variableExpression) {
        return Promise.resolve({
            variable: variableExpression.token.lexeme
        });
    }

    async visitCallExpression(callExpression) {
        return {
            functionCall: {
                name: await this.evaluate(callExpression.callee),
                args: callExpression.args.map(async arg => await this.evaluate(arg))
            }
        }
    }
}

export default ASTPrinter;