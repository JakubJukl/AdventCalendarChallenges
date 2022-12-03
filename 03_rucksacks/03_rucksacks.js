const fs = require('fs');

function splitToCompartments(rucksack) {
    if (rucksack.length % 2 === 0) {
        const compartments = [];
        compartments.push(rucksack.substring(0, rucksack.length/2));
        compartments.push(rucksack.substring(rucksack.length/2, rucksack.length));
        return compartments;
    } else throw new Error('Rucksack length is not even');
}

function findDuplicateSupplies(compartments) {
    const duplicateSupplies = [];
    const rucksackDict = {}
    for (let supply of compartments[0]) {
        rucksackDict[supply] = 1;
    }
    for (let supply of compartments[1]) {
        if (supply in rucksackDict && !duplicateSupplies.includes(supply)) {
            duplicateSupplies.push(supply);
        }
    }
    return duplicateSupplies;
}

function getPriorityValue(supply) {
    const charCode = supply.charCodeAt(0);
    let priority;
    // lowercase and uppercase have different priorities
    if (charCode >= 97) priority = charCode - 96;
    else priority = charCode - 38;
    return priority;
}

function sumPriorityValues(duplicateSupplies) {
    let sum = 0;
    for (let supply of duplicateSupplies) {
        sum += getPriorityValue(supply);
    }
    return sum;
}

function sumRucksacksPriorities(rucksacks) {
    let sum = 0;
    for (let rucksack of rucksacks) {
        const compartments = splitToCompartments(rucksack);
        const duplicates = findDuplicateSupplies(compartments);
        sum += sumPriorityValues(duplicates);
    }
    return sum;
}

function sumGroupsPriorities(rucksacks) {
    let sum = 0;
    for (let i = 0; i < rucksacks.length; i += 3) {
        if (rucksacks[i].length === 0) continue;
        // we don't care about compartments, so find duplicates in first 2 rucksacks
        let duplicates = findDuplicateSupplies([rucksacks[i], rucksacks[i+1]]);
        // find duplicates with the last rucksack
        duplicates = findDuplicateSupplies([duplicates, rucksacks[i+2]]);
        sum += sumPriorityValues(duplicates);
    }
    return sum;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(sumRucksacksPriorities(input));
console.log(sumGroupsPriorities(input));
