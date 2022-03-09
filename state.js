let state = {};
let inTransaction = false;

// stateStack
// This will let us traverse back N number of operations if needed?
// initialize with empty state
// now we can time travel
const stateSnapshots = [{}];

// DURING transactions, keep a count of how many operations were performed
// if ROLLBACK - then retrieve state N number of items back
// if new BEGIN, keep track of past blocks so we know how far to go back
let transactionCounter = 0;
const incrementTransaction = () => {
    transactionCounter += 1;
}
let blockCounter = 0;
const incrementBlock = () => {
    blockCounter += 1;
}

// blockMarker structure: {[blockCounterIndex]: transactionCounter]}
// eg: {1: 5, 2: 17} -> first block is transactions 1-5, second block is 6-17
let blockMarkers = {};

// never mutate state
const setState = (newState) => {
    // TODO only track statesnapshots when beginning transactions, otherwise waste of memory
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
    incrementTransaction();
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
    incrementTransaction();
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
    incrementBlock();
    inTransaction = true;
    blockMarkers[blockCounter] = transactionCounter;
}

const rollback = () => {
    if (!inTransaction) {
        return print(`NO TRANSACTION\n`);
    }

    console.log(blockMarkers);
    console.table(stateSnapshots);
    if (blockCounter > 0) {
        transactionCounter = blockMarkers[blockCounter];
        delete blockMarkers[blockCounter];
        blockCounter -= 1;
        const lastState = stateSnapshots[transactionCounter];
        setState(lastState);
    } else {
        inTransaction = false;
        transactionCounter = 0;
        blockCounter = 0;
    }
}

const commit = () => {
    inTransaction = false;
    transactionCounter = 0;
    blockCounter = 0;
    blockMarkers = {};
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
    print,
    begin,
    rollback,
    commit
}