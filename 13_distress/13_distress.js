const fs = require('fs');

class InputNumber {
    constructor(parent, number, isArray) {
        this.parent = parent;
        this.number = number;
        this.isArray = isArray;
        this.children = [];
    }
}

function createNumberInput(input, current, index) {
    const char = input[index];
    if (char === '[') {
        current = new InputNumber(current, NaN, true);
        current.parent.children.push(current);
    } else if (char === ']') {
        current = current.parent;
    } else if (char !== ',') {
        let number = parseInt(char);
        let result = 0;
        while (!isNaN(number)) {
            index++;
            result = result * 10 + number;
            number = parseInt(input[index]);
        }
        index--;
        current.children.push(new InputNumber(current, result, false));
    }
    return [current, index];
}

function parseInput(inputRows) {
    const processedInputs = [];
    for (let i = 0; i < inputRows.length; i += 3) {
        const sides = [];
        for (let k = 0; k < 2; k++) {
            const start = new InputNumber(null, NaN, true);
            let current = start;
            const left = inputRows[i + k];
            for (let j = 1; j < left.length - 1; j++) {
                [current, j] = createNumberInput(left, current, j);
            }
            sides.push(start);
        }
        processedInputs.push(sides);
    }
    return processedInputs;
}

/**
 *
 * @param left
 * @param right
 * @returns {[number, InputNumber]} -1 unordered, 0 can't yet tell, 1 ordered and finalInputNumber
 */
function isOrdered([left, right]) {
    if (left.isArray && right.isArray) {
        const minLength = Math.min(left.children.length, right.children.length);
        for (let i = 0; i < minLength; i++) {
            const [order, final] = isOrdered([left.children[i], right.children[i]]);
            if (order !== 0) return [order, final];
        }
        let returnVal;
        if (left.children.length === right.children.length) returnVal = 0;
        else if (left.children.length > right.children.length) returnVal = -1;
        else returnVal = 1;
        return [returnVal, left];
    } else if (left.isArray) {
        right.isArray = true;
        right.children = [new InputNumber(right, right.number, false)];
        right.number = NaN;
        return isOrdered([left, right]);
    } else if (right.isArray) {
        left.isArray = true;
        left.children = [new InputNumber(left, left.number, false)];
        left.number = NaN;
        return isOrdered([left, right]);
    } else {
        let returnVal;
        if (left.number > right.number) returnVal = -1;
        else if (left.number === right.number) returnVal = 0;
        else returnVal = 1;
        return [returnVal, left];
    }
}

function countOrdered(parsedInput) {
    let count = 0;
    for (let pairIndex = 0; pairIndex < parsedInput.length; pairIndex++) {
        let [order, _] = isOrdered(parsedInput[pairIndex]);
        if (order === 1) {
            count += pairIndex + 1;
        }
    }
    return count;
}

function findIndexesOfPackets(parsedInput) {
    const indexes = [[], []];
    for (let i = 0; i < parsedInput.length; i++) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                let orderedPackets = createSortPackets();
                if (isOrdered([parsedInput[i][j], orderedPackets[k]])[0] === 1) {
                    indexes[k].push(2 * i + j);
                    break;
                }
            }
        }
    }
    return indexes;
}

function calculateIndexCoef(parsedInput) {
    const indexes = findIndexesOfPackets(parsedInput);
    return (indexes[0].length + 1) * (indexes[0].length + 1 + indexes[1].length + 1);
}

function createSortPackets() {
    const firstPacket = new InputNumber(null, NaN, true);
    firstPacket.children.push(new InputNumber(firstPacket, NaN, true));
    firstPacket.children[0].children.push(new InputNumber(firstPacket.children[0], 2, false));
    const secondPacket = new InputNumber(null, NaN, true);
    secondPacket.children.push(new InputNumber(secondPacket, NaN, true));
    secondPacket.children[0].children.push(new InputNumber(secondPacket.children[0], 6, false));
    return [firstPacket, secondPacket];
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();
let parsedInput = parseInput(input);
console.log(countOrdered(parsedInput));
parsedInput = parseInput(input);
console.log(calculateIndexCoef(parsedInput));
