import RuntimeException from './exceptions/RuntimeException';

class Environment {
    constructor() {
        this.values = {};
    }

    define(name, value) {
        this.values[name] = value;
    }

    get(nameToken) {
        if (this.values.hasOwnProperty(nameToken.lexeme)) {
            return this.values[nameToken.lexeme];
        }

        throw new RuntimeException(nameToken, 'Undefined variable.');
    }
}

export default Environment;