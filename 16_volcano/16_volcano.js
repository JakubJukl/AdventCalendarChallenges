const fs = require('fs');

class Valve {
    constructor(name, tunnels, value) {
        this.name = name;
        this.tunnels = tunnels;
        this.value = value;
        this.open = false;
    }
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function goToNextValve(valve, minutesLeft, valves, score) {
    if (minutesLeft - 1 <= 0) return score;
    let maxScore = score;
    for (let i = 0; i < valve.tunnels.length; i++) {
        if (valve.name === valve.tunnels[i]) continue;
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

class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        this.queue.push(item);
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

class Node {
    constructor(name, parent, valve, depth) {
        this.name = name;
        this.valve = valve;
        this.parent = parent;
        this.depth = depth;
    }
}

function findAllPathsBFS(valves, minutes) {
    const queue = new Queue();
    queue.enqueue(new Node('AA', null, valves['AA'], 0));
    const paths = [];
    while (!queue.isEmpty()) {
        const node = queue.dequeue();
        if (node.depth === minutes) {
            paths.push(node);
        } else {
            for (const tunnel of node.valve.tunnels) {
                if (node.parent && node.parent.name === tunnel && node.valve.tunnels.length > 1) continue;
                queue.enqueue(new Node(tunnel, node, valves[tunnel], node.depth + 1));
            }
        }
    }
    return paths;
}

function backTrackPaths(nodes) {
    const backtrackedPaths = [];
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        const currentPath = [];
        while (node.parent !== null) {
            currentPath.push(node.name);
            node = node.parent;
        }
        backtrackedPaths.push(currentPath.reverse());
    }
    return backtrackedPaths;
}


function calculatePathScore(path, valves, minutes, score = 0, pathStartIndex = 0) {
    const copyValves = deepCopy(valves);
    let maxScore = score;
    for (let i = pathStartIndex; i < path.length; i++) {
        const valve = copyValves[path[i]];
        minutes -= 1;
        if (minutes <= 0) break;
        const notOpen = calculatePathScore(path, copyValves, minutes, score, i + 1);
        maxScore = Math.max(maxScore, notOpen);
        if (valve.value > 0 && !valve.open) {
            minutes -= 1;
            valve.open = true;
            const open = calculatePathScore(path, copyValves, minutes, score + valve.value * minutes, i + 1);
            maxScore = Math.max(maxScore, open);
        }
    }
    return maxScore;
}

function calculateBestPathScore(paths, valves, minutes) {
    let maxScore = 0;
    for (let i = 0; i < paths.length; i++) {
        const tempScore = calculatePathScore(paths[i], valves, minutes);
        maxScore = Math.max(maxScore, tempScore);
    }
    return maxScore;
}

function loadInput(inputRows) {
    const valves = {};
    for (const row of inputRows) {
        const matches = row.match(/[A-Z][A-Z]/g);
        const name = matches.shift();
        valves[name] = new Valve(name, matches, parseInt(row.match(/\d+/)[0]));
    }
    return valves;
}

const input = fs.readFileSync('test.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

const valves = loadInput(input);
// const paths = backTrackPaths(findAllPathsBFS(valves, 30));
// console.log(paths);
const paths = [[ 'DD', 'CC', 'BB', 'AA', 'DD', "AA", "II", "JJ", "II", "AA", "DD", "EE", "FF", "GG", "HH", "GG", "FF", "EE", "DD", "CC"]]
console.log(calculateBestPathScore(paths, valves, 20));
// const maxScore = calculateBestScore(valves, 15);
// console.log(maxScore);
