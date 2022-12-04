const fs = require('fs');

function getRange(pair) {
    return pair.split('-').map(Number);
}

function getPairs(row) {
    return row.split(',');
}

function isRangeFullyContained(ranges) {
    // range 0 contains range 1
    return ranges[0][0] <= ranges[1][0] && ranges[0][1] >= ranges[1][1] ||
        // range 1 contains range 0
        ranges[0][0] >= ranges[1][0] && ranges[0][1] <= ranges[1][1];
}

function isRangeOverlapping(ranges) {
    return ranges[0][1] >= ranges[1][0] && ranges[0][1] <= ranges[1][1] ||
        ranges[1][0] >= ranges[0][0] && ranges[1][0] <= ranges[0][1] ||
        ranges[0][0] >= ranges[1][0] && ranges[0][0] <= ranges[1][1] ||
        ranges[1][1] >= ranges[0][0] && ranges[1][1] <= ranges[0][1];
}

function countFullyContainedRanges(rows) {
    let count = 0;
    for (let row of rows) {
        if (row.length > 0) {
            const pairs = getPairs(row);
            const ranges = pairs.map(getRange);
            if (isRangeFullyContained(ranges)) count += 1;
        }
    }
    return count;
}

function countOverlappingRanges(rows) {
    let count = 0;
    for (let row of rows) {
        if (row.length > 0) {
            const pairs = getPairs(row);
            const ranges = pairs.map(getRange);
            if (isRangeOverlapping(ranges)) count += 1;
        }
    }
    return count;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(countFullyContainedRanges(input));
console.log(countOverlappingRanges(input));
