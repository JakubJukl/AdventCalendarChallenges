const fs = require('fs');

class Position {
    constructor(line, column, characterCode, parent = null) {
        this.line = line;
        this.column = column;
        this.characterCode = characterCode;
        this.parent = parent;
    }
}

class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

const START = 'S';
const END = 'E';

function findStartAndEnd(inputRows) {
    let start = null;
    let end = null;
    for (let i = 0; i < inputRows.length; i++) {
        for (let j = 0; j < inputRows[i].length; j++) {
            if (inputRows[i][j] === START) {
                start = new Position(i, j, 97);
            } else if (inputRows[i][j] === END) {
                end = new Position(i, j, 122);
            }
            if (start && end) {
                return [start, end];
            }
        }
    }
}

function addMove(moves, position, inputRows, lineOffset, columnOffset) {
    let charCode = inputRows[position.line + lineOffset].charCodeAt(position.column + columnOffset);
    if (charCode === 83) charCode = position.characterCode;
    const newMove = new Position(position.line + lineOffset, position.column + columnOffset, charCode);
    if ((charCode === position.characterCode ||
            charCode === position.characterCode - 1 ||
            charCode > position.characterCode)) {
        moves.push(newMove);
    }
}

function getPossibleMoves(position, inputRows) {
    const moves = [];
    if (position.line > 0) {
        addMove(moves, position, inputRows, -1, 0);
    }
    if (position.line < inputRows.length - 1) {
        addMove(moves, position, inputRows, 1, 0);
    }
    if (position.column > 0) {
        addMove(moves, position, inputRows, 0, -1);
    }
    if (position.column < inputRows[0].length - 1) {
        addMove(moves, position, inputRows, 0, 1);
    }
    return moves;
}

function visitedKey(position) {
    return `${position.line},${position.column}`;
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function dfs(inputRows, start, end, visited, shortestPath, recursionDepth = 0) {
    if (recursionDepth >= shortestPath || (start.line === end.line && start.column === end.column)) {
        return shortestPath < recursionDepth ? [shortestPath, false] : [recursionDepth, true];
    } else {
        const moves = getPossibleMoves(start, inputRows);
        let tempShortestPath = shortestPath;
        let foundPath = false;
        for (let i = 0; i < moves.length; i++) {
            if (visited[visitedKey(moves[i])] === undefined) {
                visited[visitedKey(moves[i])] = true;
                const newVisited = deepCopy(visited);
                let [movePath, moveFound] = dfs(inputRows, moves[i], end, newVisited, tempShortestPath, recursionDepth + 1);
                if (moveFound) foundPath = true;
                if (movePath < tempShortestPath) tempShortestPath = movePath;
            }
        }
        return [tempShortestPath, foundPath];
    }
}

function bfs(inputRows, start, end) {
    const queue = new Queue();
    queue.enqueue(start);
    const visited = {};
    visited[visitedKey(start)] = true;
    while (!queue.isEmpty()) {
        const position = queue.dequeue();
        if (position.line === end.line && position.column === end.column) {
            return position;
        } else {
            const moves = getPossibleMoves(position, inputRows);
            for (let i = 0; i < moves.length; i++) {
                if (!visited[visitedKey(moves[i])]) {
                    visited[visitedKey(moves[i])] = true;
                    moves[i].parent = position;
                    queue.enqueue(moves[i]);
                }
            }
        }
    }
}

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

function visualize(inputRows, currentPosition) {
    // process.stdout.write('\x1Bc');
    const parent = currentPosition.parent ? currentPosition.parent : currentPosition;
    const outputRows = [];
    for (let i = 0; i < inputRows.length; i++) {
        outputRows.push(inputRows[i]);
        if (i === parent.line) outputRows[i] = replaceAt(inputRows[i], parent.column, 'P');
        if (i === currentPosition.line) outputRows[i] = replaceAt(inputRows[i], parent.column, '*');
    }
    console.log(outputRows.join('\n'));
    console.log('---------------------');

}

function findPath(inputRows) {
    const [start, end] = findStartAndEnd(inputRows);
    let final = bfs(inputRows, end, start);
    let pathLength = 0;
    while (final.parent) {
        pathLength++;
        final = final.parent;
    }
    return pathLength;
    // const visited = {};
    // visited[visitedKey(end)] = true;
    // dfs(inputRows, end, start, visited, Number.MAX_SAFE_INTEGER);
}


const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();
console.log(findPath(input));


