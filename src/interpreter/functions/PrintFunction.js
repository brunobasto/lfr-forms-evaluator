import Callable from "../Callable";

class PrintFunction extends Callable {
    arity() {
        return 1;
    }

    async doCall(interpreter, args) {
        console.log('This output is from the example print function: ', ...args);

        return Promise.resolve(null);
    }
}

export default PrintFunction;