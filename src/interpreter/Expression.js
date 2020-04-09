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

    accept(visitor) {
        return visitor.visitBinaryExpression(this);
    }
}

Expression.Binary = Binary;

class Unary extends Expression {
    constructor(operator, right) {
        super();

        this.operator = operator;
        this.right = right;
    }

    accept(visitor) {
        return visitor.visitUnaryExpression(this);
    }
}

Expression.Unary = Unary;

class Literal extends Expression {
    constructor(value) {
        super();

        this.value = value;
    }

    accept(visitor) {
        return visitor.visitLiteralExpression(this);
    }
}

Expression.Literal = Literal;

class Variable extends Expression {
    constructor(token) {
        super();

        this.token = token;
    }

    accept(visitor) {
        return visitor.visitVariableExpression(this);
    }
}

Expression.Variable = Variable;

class Grouping extends Expression {
    constructor(expression) {
        super();

        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitGroupingExpression(this);
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

    accept(visitor) {
        return visitor.visitLogicalExpression(this);
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

    accept(visitor) {
        return visitor.visitCallExpression(this);
    }
}

Expression.Call = Call;

export default Expression;