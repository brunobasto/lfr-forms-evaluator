import Callable from "../Callable";

class PrintFunction extends Callable {
    doCall(interpreter, args) {
        console.log('This output is from the example print function: ', ...args);
    }

    arity() {
        return 1;
    }
}

export default PrintFunction;