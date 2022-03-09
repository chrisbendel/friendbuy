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
// eg: {1: 5, 2: 17} -> first block starts at transaction 5, second block starts at transaction 17
let blockMarkers = {};

// state is immutable, reassign every time
const setState = (newState) => {
    // TODO only track statesnapshots when beginning transactions, otherwise waste of memory
    // use object.create to avoid memory/reference BS
    stateSnapshots.push(Object.create(newState));
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
    return value;
}

const unset = (name) => {
    if (!name) {
        print('Missing name\n');
    }
    const newState = Object.create(state);
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
    return matchLength;
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
        print(`NO TRANSACTION\n`);
        return `NO TRANSACTION`;
    }

    if (blockCounter > 0) {
        transactionCounter = blockMarkers[blockCounter];
        delete blockMarkers[blockCounter];
        blockCounter -= 1;
        const lastState = stateSnapshots[transactionCounter];
        stateSnapshots.splice(transactionCounter + 1);
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