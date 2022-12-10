const fs = require('fs');

function doInstruction(x, cycle, instruction) {
    let newX, newCycle;
    if (instruction === 'noop') {
        [newX, newCycle] = [x, cycle + 1];
    } else {
        const [_, value] = instruction.split(' ');
        [newX, newCycle] = [x + parseInt(value), cycle + 2];
    }
    return [newX, newCycle];
}

function signalStrengths(inputRows, checkStrength) {
    let x = 1;
    let cycle = 0;
    let checkStrengthIndex = 0;
    let currentCheckStrength = checkStrength[0];
    const results = [];
    for (let rowIndex = 0; rowIndex < inputRows.length; rowIndex++) {
        const instruction = inputRows[rowIndex];
        const [oldX, oldCycle] = [x, cycle];
        [x, cycle] = doInstruction(x, cycle, instruction);
        if (oldCycle < currentCheckStrength && cycle >= currentCheckStrength) {
            results.push(oldX);
            checkStrengthIndex++;
            if (checkStrengthIndex >= checkStrength.length) break;
            currentCheckStrength = checkStrength[checkStrengthIndex];
        }
    }
    return results;
}

function sumSignalStrengths(inputRows, checkStrength) {
    const strengths = signalStrengths(inputRows, checkStrength);
    let result = 0;
    for (let i = 0; i < strengths.length; i++) {
        result += checkStrength[i] * strengths[i];
    }
    return result;
}

function generateImg(inputRows) {
    const img = [];
    let x = 1;
    let cycle = 0;
    for (let rowIndex = 0; rowIndex < inputRows.length; rowIndex++) {
        const instruction = inputRows[rowIndex];
        const [oldX, oldCycle] = [x, cycle];
        [x, cycle] = doInstruction(x, cycle, instruction);
        const max = Math.max(oldCycle, cycle);
        const min = Math.min(oldCycle, cycle);
        const diff = max - min;

        for (let i = 0; i < diff; i++) {
            const imgIndex =  Math.floor((oldCycle + i) / 40);
            const imgRowIndex = (oldCycle + i) - (imgIndex * 40);

            let charToPush;
            if (imgRowIndex + 1 >= oldX && imgRowIndex < oldX + 2) {
                charToPush = '#';
            } else {
                charToPush = '.';
            }
            if (img[imgIndex] === undefined) img[imgIndex] = [];
            img[imgIndex].push(charToPush);
        }

    }
    return img;
}

function printImg(img) {
    for (let i = 0; i < img.length; i++) {
        console.log(img[i].join(''));
    }
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

console.log(sumSignalStrengths(input, [20, 60, 100, 140, 180, 220]));
printImg(generateImg(input));
