const fs = require('fs');

function createReservoir(inputRows) {
    const reservoir = {};
    for (let i = 0; i < inputRows.length; i++) {
        const split = inputRows[i].split(' -> ');
        for (let j = 0; j < split.length - 1; j++) {
            let [startX, startY] = split[j].split(',').map(Number);
            let [stopX, stopY] = split[j + 1].split(',').map(Number);
            let tmp = Math.min(startX, stopX);
            stopX = Math.max(startX, stopX);
            startX = tmp;
            tmp = Math.min(startY, stopY);
            stopY = Math.max(startY, stopY);
            startY = tmp;
            for (let col = startX; col <= stopX; col++) {
                if (!reservoir[col]) reservoir[col] = {};
                reservoir[col][startY] = 1;
            }
            for (let row = startY; row <= stopY; row++) {
                if (!reservoir[startX]) reservoir[startX] = {};
                reservoir[startX][row] = 1;
            }
        }
    }
    return reservoir;
}

function canMoveDiagonal(destinationX, destinationY, reservoir) {
    if (!reservoir[destinationX]) return false;
    if (!reservoir[destinationX][destinationY]) {
        return moveSandToReservoir(destinationX, destinationY, reservoir);
    }
    return null;
}

function moveSandToReservoir(sandX, sandY, reservoir) {
    if (!reservoir[sandX]) return false;
    const lines = Object.keys(reservoir[sandX]).map(Number);
    let lowestLine = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] < lowestLine && lines[i] > sandY) lowestLine = lines[i];
    }
    if (lowestLine === Number.MAX_SAFE_INTEGER) return false;

    for (let direction of [-1, 1]) {
        let diagonal = canMoveDiagonal(sandX + direction, lowestLine, reservoir);
        if (diagonal !== null) {
            return diagonal;
        }

    }

    return [true, sandX, lowestLine - 1];
}

function printReservoir(reservoir) {
    const cols = Object.keys(reservoir).map(Number);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
    let maxRow = 0;
    for (let i = minCol; i <= maxCol; i++) {
        const rows = Object.keys(reservoir[i]).map(Number);
        maxRow = Math.max(maxRow, ...rows);
    }
    const newReservoir = Array(maxRow + 1);
    for (let i = 0; i < newReservoir.length; i++) {
        newReservoir[i] = Array(maxCol - minCol + 1).fill('.');
    }
    for (let i = minCol; i <= maxCol; i++) {
        const rows = Object.keys(reservoir[i]).map(Number);
        for (let j = 0; j < rows.length; j++) {
            if (reservoir[i][rows[j]] === 1) {
                newReservoir[rows[j]][i - minCol] = '#';
            } else {
                newReservoir[rows[j]][i - minCol] = 'o';
            }
        }
    }
    for (let i = 0; i < newReservoir.length; i++) {
        console.log(newReservoir[i].join(''));
    }
}

function fillReservoirWithSand(reservoir) {
    let sandCount = 0;
    let sand;
    do {
        sand = moveSandToReservoir(500, 0, reservoir);
        sandCount++;
        console.log(sandCount);
        if (sand) reservoir[sand[1]][sand[2]] = true;
    } while (sand)
    return sandCount - 1;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

console.log(fillReservoirWithSand(createReservoir(input)));
