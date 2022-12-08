const fs = require('fs');

function checkCols(inputRows, row, column, start, end, theTreeHeight) {
    let visible = true;
    for (let i = start; i < end; i++) {
        if (parseInt(inputRows[i][column]) >= theTreeHeight) {
            visible = false;
            break;
        }
    }
    return visible;
}

function countVisibleCols(inputRows, row, column, start, end, theTreeHeight) {
    let visibleCount = 0;
    const increment = start < end;
    // it's more readable with two for loops, in an if else statement, I am well aware
    // it can be done without it, but I don't pay for lines of code, so I don't care
    if (increment) {
        for (let i = start; i < end; i++) {
            const currentTreeHeight = parseInt(inputRows[i][column]);
            visibleCount += 1;
            if (currentTreeHeight >= theTreeHeight) break;
        }
    } else {
        for (let i = start; i > end; i--) {
            const currentTreeHeight = parseInt(inputRows[i][column]);
            visibleCount += 1;
            if (currentTreeHeight >= theTreeHeight) break;
        }
    }
    return visibleCount;
}

function checkRows(inputRows, row, column, start, end, theTreeHeight) {
    let visible = true;
    for (let i = start; i < end; i++) {
        if (parseInt(inputRows[row][i]) >= theTreeHeight) {
            visible = false;
            break;
        }
    }
    return visible;
}

function countVisibleRows(inputRows, row, column, start, end, theTreeHeight) {
    let visibleCount = 0;
    const increment = start < end;
    if (increment) {
        for (let i = start; i < end; i++) {
            const currentTreeHeight = parseInt(inputRows[row][i]);
            visibleCount += 1;
            if (currentTreeHeight >= theTreeHeight) break;
        }
    } else {
        for (let i = start; i > end; i--) {
            const currentTreeHeight = parseInt(inputRows[row][i]);
            visibleCount += 1;
            if (currentTreeHeight >= theTreeHeight) break;
        }
    }
    return visibleCount;
}


function isTreeVisible(inputRows, row, column) {
    const theTreeHeight = parseInt(inputRows[row][column]);
    const visibleArray = [];
    visibleArray.push(checkCols(inputRows, row, column, 0, row, theTreeHeight));
    if (visibleArray.reduce((acc, val) => acc || val)) return true;
    visibleArray.push(checkCols(inputRows, row, column, row + 1, inputRows.length, theTreeHeight));
    if (visibleArray.reduce((acc, val) => acc || val)) return true;
    visibleArray.push(checkRows(inputRows, row, column, 0, column, theTreeHeight));
    if (visibleArray.reduce((acc, val) => acc || val)) return true;
    visibleArray.push(checkRows(inputRows, row, column, column + 1, inputRows[row].length, theTreeHeight));
    return visibleArray.reduce((acc, val) => acc || val);
}

function countVisibleTrees(inputRows) {
    if (inputRows[inputRows.length - 1].length === 0) inputRows.pop();
    let sum = 2 * inputRows.length + 2 * inputRows[0].length - 4;
    for (let i = 1; i < inputRows.length - 1; i++) {
        for (let j = 1; j < inputRows[i].length - 1; j++) {
            if (isTreeVisible(inputRows, i, j)) {
                sum += 1;
            }
        }
    }
    return sum;
}

function calcScenicScore(inputRows, row, column) {
    return countVisibleCols(inputRows, row, column, row - 1, -1, parseInt(inputRows[row][column])) *
    countVisibleCols(inputRows, row, column, row + 1, inputRows.length, parseInt(inputRows[row][column])) *
    countVisibleRows(inputRows, row, column, column - 1, -1, parseInt(inputRows[row][column])) *
    countVisibleRows(inputRows, row, column, column + 1, inputRows[row].length, parseInt(inputRows[row][column]));
}

function getTreeScenicScore(inputRows) {
    if (inputRows[inputRows.length - 1].length === 0) inputRows.pop();
    let highestScore = 0;
    for (let i = 0; i < inputRows.length; i++) {
        for (let j = 0; j < inputRows[i].length; j++) {
            const tempScore = calcScenicScore(inputRows, i, j);
            if (tempScore > highestScore) highestScore = tempScore;
        }
    }
    return highestScore;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(countVisibleTrees(input));
console.log(getTreeScenicScore(input));
