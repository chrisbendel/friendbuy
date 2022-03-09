let state = {};

// stateStack
// This will let us traverse back N number of operations if needed?
// initialize with empty state
// now we can time travel
const stateSnapshots = [{}];

// DURING transactions, keep a count of how many operations were performed
// if rollback - then retrieve state N number of items back
let transactionCounter = 0;

const incrementTransaction = () => {
    transactionCounter += 1;
}

const resetTransaction = () => {
    transactionCounter = 0;
}

// dont mutate state
const setState = (newState) => {
    stateSnapshots.push(newState);
    state = newState;
};

const getState = () => {
    return state;
}

const set = (name, value) => {
    if (!name) {
        print('Missing name\n');
    }

    if (!value) {
        print('Missing value\n');
    }

    setState({
        ...state,
        [name]: value
    });
    print('\n');
}

const get = (name) => {
    if (!name) {
        print('Missing name\n');
    }
    const value = getState()[name] || null;
    print(`${value}\n`);
}

const unset = (name) => {
    if (!name) {
        print('Missing name\n');
    }
    const newState = state;
    delete newState[name];
    setState(newState);
}

const numEqualTo = (value) => {
    if (!value) {
        print('Missing value\n');
    }
    const matchLength = Object.values(state).filter(v => v === value).length;
    print(`${matchLength}\n`);
}

const end = () => {
    print('Thanks for using badredis™!\n');
    process.exit(0);
}

const all = () => {
    console.table(getState());
}

const begin = () => {

}

const rollback = () => {

}

const commit = () => {

}

// To avoid any weirdness with console.log and the CLI
// precaution cause console.log automatically appends \n 
// and we may not want that at some point?
const print = (str) => {
    process.stdout.write(str);
}

module.exports = {
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
}