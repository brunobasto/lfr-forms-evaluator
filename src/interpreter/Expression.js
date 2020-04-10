class Expression {
    constructor() {

    }
}

class Binary extends Expression {
    constructor(left, operator, right) {
        super();

        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    async accept(visitor) {
        return await visitor.visitBinaryExpression(this);
    }
}

Expression.Binary = Binary;

class Unary extends Expression {
    constructor(operator, right) {
        super();

        this.operator = operator;
        this.right = right;
    }

    async accept(visitor) {
        return await visitor.visitUnaryExpression(this);
    }
}

Expression.Unary = Unary;

class Literal extends Expression {
    constructor(value) {
        super();

        this.value = value;
    }

    async accept(visitor) {
        return await visitor.visitLiteralExpression(this);
    }
}

Expression.Literal = Literal;

class Variable extends Expression {
    constructor(token) {
        super();

        this.token = token;
    }

    async accept(visitor) {
        return await visitor.visitVariableExpression(this);
    }
}

Expression.Variable = Variable;

class Grouping extends Expression {
    constructor(expression) {
        super();

        this.expression = expression;
    }

    async accept(visitor) {
        return await visitor.visitGroupingExpression(this);
    }
}

Expression.Grouping = Grouping;

class Logical extends Expression {
    constructor(left, operator, right) {
        super();

        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    async accept(visitor) {
        return await visitor.visitLogicalExpression(this);
    }
}

Expression.Logical = Logical;

class Call extends Expression {
    constructor(callee, args, closingParenthesis) {
        super();

        this.callee = callee;
        this.closingParenthesis = closingParenthesis;
        this.args = args;
    }

    async accept(visitor) {
        return await visitor.visitCallExpression(this);
    }
}

Expression.Call = Call;

export default Expression;