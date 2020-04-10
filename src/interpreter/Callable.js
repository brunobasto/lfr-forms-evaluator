class Callable {
    arity() {
        return 0;
    }

    async doCall() {
        return Promise.resolve(null);
    }
}

export default Callable;