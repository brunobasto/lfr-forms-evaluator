const fs = require('fs');
const readline = require('readline');
const Scanner = require('../interpreter/Scanner');

const yargs = require('yargs').usage('Usage: expr [file]')

const run = source => {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    console.log('Interpret source here', tokens);
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

const { argv } = yargs;

if (argv._.length === 0) {
    runPrompt();
}
else if (argv._.length === 1) {
    runFile(argv._[0]);
}
else {
    yargs.showHelp();
}