const fs = require('fs');

class Monkey {
    /**
     * @param {number[]} items monkey inventory
     * @param {function(worryLevel: number): number} operation modify worry level after inspection
     * @param {function(worryLevel: number): number} action to which monkey throw the item
     */
    constructor(items, operation, action) {
        this.items = items;
        this.operation = operation;
        this.action = action;
        this.inspectedCount = 0;
    }
}

function monkeyTurn(monkey) {
    const monkeyIndexes = [];
    for (let i = 0; i < monkey.items.length; i++) {
        monkey.inspectedCount++;
        monkey.items[i] = Math.floor(monkey.operation(monkey.items[i]) / 3);
        monkeyIndexes.push(monkey.action(monkey.items[i]));
    }
    return monkeyIndexes;
}

function monkeysRound(monkeys) {
    for (let i = 0; i < monkeys.length; i++) {
        monkeyTurn(monkeys[i]).forEach((monkeyIndex) => {
           monkeys[monkeyIndex].items.push(monkeys[i].items.shift());
        });
    }
}

function playRounds(monkeys, roundCount) {
    for (let i = 0; i < roundCount; i++) {
        monkeysRound(monkeys);
    }
}

function getMonkeyBusiness(monkeys, numberOfMonkeys) {
    const inspectedCounts = [];
    for (let i = 0; i < monkeys.length; i++) {
        inspectedCounts.push(monkeys[i].inspectedCount);
    }
    inspectedCounts.sort((a, b) => b - a);
    let monkeyBusiness = 1;
    for (let i = 0; i < numberOfMonkeys; i++) {
        monkeyBusiness *= inspectedCounts[i];
    }
    return monkeyBusiness;
}

function getOperationNumber(operationInputNumber, worryLevel) {
    return operationInputNumber === 'old' ? worryLevel : Number(operationInputNumber);
}

operationMatrix = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
}

function createOperation(operationInput) {
    return (worryLevel) => {
        const numberOne = getOperationNumber(operationInput[0], worryLevel);
        const numberTwo = getOperationNumber(operationInput[2], worryLevel);
        return operationMatrix[operationInput[1]](numberOne, numberTwo);
    }
}

function createAction(divisibleTestNumber, trueActionNumber, falseActionNumber) {
    return (worryLevel) => {
        return worryLevel % divisibleTestNumber === 0 ? trueActionNumber : falseActionNumber;
    }
}

function getMonkeysFromInput(inputRows) {
    const monkeys = [];
    for (let i = 0; i < inputRows.length; i+=7) {
        // 0th line is monkey index, idc about that
        // 1st line is list of items
        const items = inputRows[i + 1].substring(18).split(', ').map(Number);
        // 2nd line is operation
        const operationInput = inputRows[i + 2].substring(19).split(' ');
        const operation = createOperation(operationInput);
        // 3rd line is test
        const divisibleTestNumber = Number(inputRows[i + 3].substring(21));
        // 4th line is action if true
        const trueActionNumber = Number(inputRows[i + 4].substring(29));
        // 5th line is action if false
        const falseActionNumber = Number(inputRows[i + 5].substring(30));
        const action = createAction(divisibleTestNumber, trueActionNumber, falseActionNumber);
        monkeys.push(new Monkey(items, operation, action));
        //6th line is empty
    }
    return monkeys;
}


const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

const monkeys = getMonkeysFromInput(input)
playRounds(monkeys, 20);
console.log(getMonkeyBusiness(monkeys, 2));
