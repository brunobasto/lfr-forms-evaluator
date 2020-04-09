import {asTree} from 'treeify';

class ASTPrinter {
    constructor(expression) {
        this.expression = expression;
    }

    evaluate(expression) {
        return expression.accept(this);
    }

    print() {
        return asTree(this.expression.accept(this), true);
    }

    visitBinaryExpression(binaryExpression) {
        const left = this.evaluate(binaryExpression.left);
        const right = this.evaluate(binaryExpression.right);
        const operator = binaryExpression.operator;

        return {[operator]: {left, right}};
    }

    visitUnaryExpression(unaryExpression) {
        const right = this.evaluate(unaryExpression.right);
        const operator = unaryExpression.operator;

        return {[operator]: {right}};
    }

    visitLiteralExpression(literalExpression) {
        return literalExpression.value;
    }

    visitGroupingExpression(groupingExpression) {
        return this.evaluate(groupingExpression.expression);
    }

    visitLogicalExpression(logicalExpression) {
        return this.visitBinaryExpression(logicalExpression);
    }
    
    visitVariableExpression(variableExpression) {
        return {
            variable: variableExpression.token.lexeme
        }
    }
}

export default ASTPrinter;