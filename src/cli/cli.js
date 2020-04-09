import fs from'fs';
import readline from 'readline';
import yargs from 'yargs';

import Scanner from '../interpreter/Scanner';
import Parser from '../interpreter/Parser';
import Interpreter from '../interpreter/Interpreter';
import ASTPrinter from '../interpreter/util/ASTPrinter';
import Environment from '../interpreter/Environment';

const cli = yargs.usage('Usage: expr [file]')

const run = source => {
    // Scan

    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    console.log('\nTokens:\n', tokens);

    // Parse

    const parser = new Parser(tokens);

    const expression = parser.parse();

    const astPrinter = new ASTPrinter(expression);

    console.log('\nAST:\n', astPrinter.print());

    // Interpret

    const environment = new Environment();

    environment.define('fieldName', 'predefinedValue');

    const interpreter = new Interpreter(expression, environment);

    console.log('\nResult:\n', interpreter.interpret(), '\n');
}

const runFile = filePath => {
    fs.readFile(filePath, (err, code) => {
        if (err) {
            console.error(err)
            return
        }

        run(code.toString('UTF-8'));
    });
};

const runPrompt = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("> ", code => {
        rl.close();

        // Interpret
        run(code);
        // Recurse
        runPrompt();
    })
}

const { argv } = cli;

if (argv._.length === 0) {
    runPrompt();
}
else if (argv._.length === 1) {
    runFile(argv._[0]);
}
else {
    cli.showHelp();
}