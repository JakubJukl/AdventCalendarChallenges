const fs = require('fs');

class Valve {
    constructor(tunnels, value) {
        this.tunnels = tunnels;
        this.value = value;
        this.open = false;
    }
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function goToNextValve(valve, minutesLeft, valves, score) {
    if (minutesLeft <= 20 && score < 150) return score
    if (minutesLeft - 1 <= 0) return score;
    let maxScore = score;
    for (let i = 0; i < valve.tunnels.length; i++) {
        const nextValve = valves[valve.tunnels[i]];
        const notOpening = goToNextValve(nextValve, minutesLeft - 1, deepCopy(valves), score);
        let opening = 0;
        if (!nextValve.open && nextValve.value > 0 && minutesLeft - 2 > 0) {
            opening = goToNextValve(nextValve, minutesLeft - 2, deepCopy(valves),
                score + ((minutesLeft - 2) * nextValve.value));
        }
        maxScore = Math.max(maxScore, notOpening, opening);
    }
    return maxScore;
}

function calculateBestScore(valves, minutes) {
    return goToNextValve(valves['AA'], minutes, deepCopy(valves), 0);
}

function loadInput(inputRows) {
    const valves = {};
    for (const row of inputRows) {
        const matches = row.match(/[A-Z][A-Z]/g);
        valves[matches.shift()] = new Valve(matches, parseInt(row.match(/\d+/)[0]));
    }
    return valves;
}

const input = fs.readFileSync('test.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

const valves = loadInput(input);
// const maxScore = calculateBestScore(valves, 30);
// console.log(maxScore);
