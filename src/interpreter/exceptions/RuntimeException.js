class RuntimeException extends Error {
    constructor(token, message) {
        return super(`${message}\n\tat '${token.lexeme}' [line ${token.line}]`);
    }
}

export default RuntimeException;