const fs = require('fs');

function findMostCaloricElf(inputRows) {
    let mostCaloric = null;
    let currentElf = 0;
    for (let row of inputRows) {
        if (row.length === 0) {
            if (!mostCaloric || currentElf > mostCaloric) {
                mostCaloric = currentElf;
            }
            currentElf = 0;
        } else {
            currentElf += parseInt(row);
        }
    }
    return mostCaloric;
}

function findTopThreeCaloricElfs(inputRows) {
    const topThree = [0, 0, 0];
    let currentElf = 0;
    for (let row of inputRows) {
        if (row.length === 0) {
            if (currentElf > topThree[0]) {
                topThree[2] = topThree[1];
                topThree[1] = topThree[0];
                topThree[0] = currentElf;
            } else if (currentElf > topThree[1]) {
                topThree[2] = topThree[1];
                topThree[1] = currentElf;
            } else if (currentElf > topThree[2]) {
                topThree[2] = currentElf;
            }
            currentElf = 0;
        } else {
            currentElf += parseInt(row);
        }
    }
    return topThree[0] + topThree[1] + topThree[2];
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(findMostCaloricElf(input));
console.log(findTopThreeCaloricElfs(input));
