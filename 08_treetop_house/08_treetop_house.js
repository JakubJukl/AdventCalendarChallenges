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

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(countVisibleTrees(input));
