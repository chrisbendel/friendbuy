const {
    set,
    get,
    unset,
    numEqualTo,
    end,
    all,
    incrementTransaction,
    resetTransaction,
    print,
    begin,
    rollback,
    commit
} = require('./state');

// Setup
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readLine.setPrompt('badredis> ');
readLine.prompt();

// Main loop, wait for user input to continue
readLine.on('line', function(line) {
    const inputs = line.split(' ');
    const command = inputs[0].toLowerCase().trim();
    let name;
    let value;
    if (command === 'numequalto') {
        name = null;
        value = inputs[1] || null;
    } else {
        name = inputs[1] || null;
        value = inputs[2] || null;
    }

    switch (command) {
        case 'set':
            set(name, value);
            break;
        case 'get':
            get(name);
            break;
        case 'unset':
            unset(name);
            break;
        case 'numequalto':
            numEqualTo(value);
            break;
        case 'all':
            all();
            break;
        case 'end':
            end();
            break;
        case 'begin':
            print('set!');
            break;
        case 'rollback':
            print('set!');
            break;
        case 'commit':
            print('set!');
            break;
        default:
            print(`
                Unknown command.\n
                Basic commands (commands are case insensitive, keys are case sensitive): \n
                SET <name> <value>\n
                GET <name>\n
                UNSET <name>\n
                NUMEQUALTO <value>\n
                END\n
                ALL\n
                <------------------>\n
                For transactions:\n
                BEGIN\n
                ROLLBACK\n
                COMMIT\n
            `);
            break;
    }
    readLine.prompt();
}).on('close', function() {
    end();
});