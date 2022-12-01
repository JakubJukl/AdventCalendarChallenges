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

const input = fs.readFileSync('input.txt', 'utf8');
console.log(findMostCaloricElf(input.split('\r\n')));
