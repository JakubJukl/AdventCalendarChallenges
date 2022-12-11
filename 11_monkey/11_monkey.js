const fs = require('fs');

class Monkey {
    /**
     * @param {string[]} items monkey inventory
     * @param {function(worryLevel: string): string} operation modify worry level after inspection
     * @param {function(worryLevel: string): number} action to which monkey throw the item
     */
    constructor(items, operation, action) {
        this.items = items;
        this.operation = operation;
        this.action = action;
        this.inspectedCount = 0;
    }
}

function monkeyTurn(monkey, divideBy) {
    const monkeyIndexes = [];
    for (let i = 0; i < monkey.items.length; i++) {
        monkey.inspectedCount++;
        let newWorryLevel;
        if (divideBy === 1) newWorryLevel = monkey.operation(monkey.items[i]);
        else newWorryLevel = Math.floor(monkey.operation(monkey.items[i]) / divideBy);
        monkey.items[i] = newWorryLevel;
        monkeyIndexes.push(monkey.action(monkey.items[i]));
    }
    return monkeyIndexes;
}

function monkeysRound(monkeys, divideBy) {
    for (let i = 0; i < monkeys.length; i++) {
        monkeyTurn(monkeys[i], divideBy).forEach((monkeyIndex) => {
           monkeys[monkeyIndex].items.push(monkeys[i].items.shift());
        });
    }
}

function playRounds(monkeys, roundCount, divideBy = 3) {
    for (let i = 0; i < roundCount; i++) {
        monkeysRound(monkeys, divideBy);
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
    return operationInputNumber === 'old' ? worryLevel : Number(operationInputNumber).toString();
}

const sum = (a, b) => {
    const [biggerNumber, smallerNumber] = a.length > b.length ? [a, b] : [b, a];
    const result = [];
    let carryOn = 0;
    for (let i = 0; i < biggerNumber.length; i++) {
        const currentBig = Number(biggerNumber[biggerNumber.length - 1 - i]);
        const smallIndex = smallerNumber.length - 1 - i;
        const currentSmall = smallIndex < 0 ? 0 : Number(smallerNumber[smallIndex]);
        let numberRes = currentBig + currentSmall + carryOn;

        if (numberRes > 9) {
            numberRes-= 10;
            carryOn = 1;
        } else carryOn = 0;
        result.push(numberRes);
    }
    if (carryOn) result.push(carryOn);
    return result.reverse().join('');
}

const multiply = (a, b) => {
    // works only when the smaller number is 2 decimal, would be easy to make it universal, but idc
    const [biggerNumber, smallerNumber] = a.length > b.length ? [a, b] : [b, a];
    const numbersToSum = [];
    const carryOns = Array(smallerNumber.length).fill(0);
    for (let i = 0; i < smallerNumber.length; i++) {
        numbersToSum.push(Array(i).fill(0));
    }

    const pushAndGetCarryOn = (numberRes, result) => {
        let carryOn = 0;
        if (numberRes > 9) {
            carryOn = Math.floor(numberRes / 10);
            numberRes = numberRes % 10;
        }
        result.push(numberRes);
        return carryOn;
    }

    const pushCarryOn = (carryOn, result) => {
        if (carryOn) result.push(carryOn);
    }

    for (let i = 0; i < biggerNumber.length; i++) {
        const currentBig = Number(biggerNumber[biggerNumber.length - 1 - i]);
        for (let j = smallerNumber.length - 1; j >= 0; j--) {
            const numberRes = currentBig * Number(smallerNumber[j]) + carryOns[smallerNumber.length - 1 - j];
            carryOns[smallerNumber.length - 1 - i] = pushAndGetCarryOn(numberRes, numbersToSum[smallerNumber.length - 1 - j]);
        }
    }
    for (let i = 0; i < numbersToSum.length; i++) {
        pushCarryOn(carryOns[i], numbersToSum[i]);
        numbersToSum[i] = numbersToSum[i].reverse().join('');
    }
    let result = numbersToSum[0];
    for (let i = 1; i < numbersToSum.length; i++) {
        result = sum(numbersToSum[i], result);
    }
    return result;
}

const divide = (a, b) => {
    if (b === '0') throw new Error('Cannot divide by 0');
    let carryOn = 0;
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const current = Number(a[i]) + carryOn * 10;
        carryOn = current % Number(b);
        const division = Math.floor(current / Number(b));
        if (division !== 0 || result.length !== 0) result.push(division);
    }
    if (!result.length) result.push(0);
    return {division: result.join(''), rest: carryOn};
}

operationMatrix = {
    '+': sum,
    '*': multiply,
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
        const division = divide(worryLevel, divisibleTestNumber);
        return division.rest === 0 ? trueActionNumber : falseActionNumber;
    }
}

function getMonkeysFromInput(inputRows) {
    const monkeys = [];
    for (let i = 0; i < inputRows.length; i+=7) {
        // 0th line is monkey index, idc about that
        // 1st line is list of items
        const items = inputRows[i + 1].substring(18).split(', ').map(x => {
            return Number(x).toString();
        });
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


const input = fs.readFileSync('test.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

// const monkeysPartOne = getMonkeysFromInput(input)
// playRounds(monkeysPartOne, 20);
// console.log(getMonkeyBusiness(monkeysPartOne, 2));

const monkeysPartTwo = getMonkeysFromInput(input)
playRounds(monkeysPartTwo, 20, 1);
console.log(monkeysPartTwo[0].inspectedCount);
console.log(monkeysPartTwo[1].inspectedCount);
console.log(monkeysPartTwo[2].inspectedCount);
console.log(monkeysPartTwo[3].inspectedCount);
// console.log(getMonkeyBusiness(monkeysPartTwo, 2));

