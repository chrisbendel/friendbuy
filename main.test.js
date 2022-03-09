const { expect } = require('@jest/globals');
const {
    set,
    get,
    unset,
    numEqualTo,
    begin,
    rollback,
    commit,
    end
} = require('./state');

describe("Scenario 1", () => {
    test("it should match all expected output", () => {
        begin();
        set('a', 10);
        let a = get('a');
        expect(a).toEqual(10);
        begin()
        set('a', 20);
        a = get('a');
        expect(a).toEqual(20);
        rollback();
        a = get('a');
        expect(a).toEqual(10);
        rollback();
        a = get('a');
        expect(a).toBeNull();
    });
});

describe("Scenario 2", () => {
    test("it should match all expected output", () => {
        begin();
        set('a', 30);
        begin();
        set('a', 40);
        commit();
        let a = get('a');
        expect(a).toEqual(40);
        let rollbackResult = rollback();
        expect(rollbackResult).toEqual(`NO TRANSACTION`);
    });
});

describe("Scenario 3", () => {
    test("it should match all expected output", () => {
        set('a', 50);
        begin();
        let a = get('a');
        expect(a).toEqual(50);
        set('a', 60);
        begin();
        unset('a');
        a = get('a');
        expect(a).toBeNull();
        rollback();
        a = get('a');
        expect(a).toEqual(60);
        commit();
        a = get('a');
        expect(a).toEqual(60);
    });
});

describe("Scenario 4", () => {
    test("it should match all expected output", () => {
        set('a', 10);
        begin();
        let numEqual = numEqualTo(10);
        expect(numEqual).toEqual(1);
        begin();
        unset('a');
        numEqual = numEqualTo(10);
        expect(numEqual).toEqual(0);
        rollback();
        numEqual = numEqualTo(10);
        expect(numEqual).toEqual(1);
        commit();
    });
});