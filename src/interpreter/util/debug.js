import ASTPrinter from "./ASTPrinter"

export const printAST = expression => {
    const printer = new ASTPrinter(expression);

    return printer.print();
}