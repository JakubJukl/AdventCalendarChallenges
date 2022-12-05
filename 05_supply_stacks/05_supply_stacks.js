const fs = require('fs');

function parseStack(stackRows) {
    const parsedStack = [];
    for (let rowIndex = 0; rowIndex < stackRows.length - 1; rowIndex++) {
        const row = stackRows[rowIndex];
        for (let i = 0; i < row.length; i+=4) {
            if (parsedStack[i/4] === undefined) parsedStack[i/4] = [];
            const char = row.charAt(i + 1);
            if (char !== ' ') parsedStack[i/4].unshift(char);
        }
    }
    return parsedStack;
}

function parseInstruction(instructionRow) {
    // [0] number of items to take from stack,
    // [1] 1 based index of stack to take from,
    // [2] 1 based index of stack to put on
    return instructionRow.match(/\d+/g);
}

function splitStackAndInstructions(input) {
    const stack = [];
    const instructions = [];
    const stackAndInstructions = {stack: stack, instructions: instructions};
    let current = stack;
    for (let row of input) {
        if (row.length === 0) current = instructions;
        else current.push(row);
    }
    return stackAndInstructions;
}

function executeInstruction(instruction, stack, sameOrderTransport) {
    const [numItems, fromIndex, toIndex] = parseInstruction(instruction);
    const items = stack[fromIndex - 1].splice(-numItems, numItems);
    if (!sameOrderTransport) items.reverse();
    stack[toIndex - 1].push(...items);
}

function reorganizeStack(input, sameOrderTransport = false) {
    const {stack, instructions} = splitStackAndInstructions(input);
    const parsedStack = parseStack(stack);
    for (let instruction of instructions) {
        executeInstruction(instruction, parsedStack, sameOrderTransport);
    }
    return parsedStack;
}

function getTopStackItems(stack) {
    return stack.map(t => t[t.length-1]).join('');
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(getTopStackItems(reorganizeStack(input)));
console.log(getTopStackItems(reorganizeStack(input, true)));
