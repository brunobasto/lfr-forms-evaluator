import fs from'fs';
import readline from 'readline';
import yargs from 'yargs';

import Scanner from '../interpreter/Scanner';
import Parser from '../interpreter/Parser';
import Interpreter from '../interpreter/Interpreter';

const cli = yargs.usage('Usage: expr [file]')

const run = source => {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    console.log('Tokens: ', tokens);

    const parser = new Parser(tokens);

    const expression = parser.parse();

    console.log(expression);

    const interpreter = new Interpreter(expression);

    console.log('Result', interpreter.interpret());
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