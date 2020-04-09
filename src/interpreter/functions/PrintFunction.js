import Callable from "../Callable";

class PrintFunction extends Callable {
    doCall(interpreter, args) {
        console.log('Internal', ...args);
    }

    arity() {
        return 1;
    }
}

export default PrintFunction;