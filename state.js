let state = {};
let inTransaction = false;

// This will let us time travel to different states
// initialize with empty state
let stateSnapshots = [{}];

// blockMarker structure: {[blockCounterIndex]: transactionCounter]}
// eg: {1: 5, 2: 17} -> first block starts at transaction 5, second block starts at transaction 17
let blockMarkers = {};

let transactionCounter = 0;
const incrementTransaction = () => {
    transactionCounter += 1;
}
let blockCounter = 0;
const incrementBlock = () => {
    blockCounter += 1;
}

const deccrementBlock = () => {
    blockCounter -= 1;
}

// state is immutable, reassign every time
const setState = (newState) => {
    stateSnapshots.push(Object.assign({}, newState));
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
    const newState = Object.assign({}, state);
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
        const lastState = stateSnapshots[transactionCounter];
        stateSnapshots.splice(transactionCounter);
        setState(lastState);
        deccrementBlock();
    }
    // } else {
    //     inTransaction = false;
    //     transactionCounter = 0;
    //     blockCounter = 0;
    //     blockMarkers = {};
    //     stateSnapshots = [{}];
    // }
}

const commit = () => {
    inTransaction = false;
    transactionCounter = 0;
    blockCounter = 0;
    blockMarkers = {};
    stateSnapshots = [{}];
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
    print,
    begin,
    rollback,
    commit
}