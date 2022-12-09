const fs = require('fs');

class RopeEnd {
    constructor(position, lastPosition) {
        this.position = position;
        this.lastPosition = lastPosition;
    }
}

class Position {
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }

    static fromPosition(position) {
        return new Position(position.line, position.column);
    }

    countDistance(position) {
        const maxLine = Math.max(this.line, position.line);
        const minLine = Math.min(this.line, position.line);
        const maxColumn = Math.max(this.column, position.column);
        const minColumn = Math.min(this.column, position.column);
        const lineDistance = maxLine - minLine;
        const columnDistance = maxColumn - minColumn;
        return Math.max(lineDistance, columnDistance);
    }

    shareBorderOrEquals(position) {
        const sameLine = this.line === position.line && (this.column === position.column || this.column === position.column - 1 || this.column === position.column + 1);
        const sameColumn = this.column === position.column && (this.line === position.line || this.line === position.line - 1 || this.line === position.line + 1);
        const corner = (this.line === position.line - 1 || this.line === position.line + 1) && (this.column === position.column - 1 || this.column === position.column + 1);
        return sameLine || sameColumn || corner;
    }
}

function moveTail(head, tail, differentMovement) {
    if (!head.position.shareBorderOrEquals(tail.position)) {
        tail.lastPosition = Position.fromPosition(tail.position);
        if (differentMovement) {
            const possiblePositions = [];
            possiblePositions.push(new Position(head.position.line - 1, head.position.column));
            possiblePositions.push(new Position(head.position.line + 1, head.position.column));
            possiblePositions.push(new Position(head.position.line, head.position.column - 1));
            possiblePositions.push(new Position(head.position.line, head.position.column + 1));
            let lowestDistancePosition = possiblePositions[0];
            let lowestDistance = lowestDistancePosition.countDistance(tail.position);
            for (let i = 1; i < possiblePositions.length; i++) {
                const distance = possiblePositions[i].countDistance(tail.position);
                if (distance < lowestDistance) {
                    lowestDistance = distance;
                    lowestDistancePosition = possiblePositions[i];
                }
            }
            tail.position = lowestDistancePosition;
        } else {
            tail.position = Position.fromPosition(head.lastPosition);
        }
    }
}

function moveHead(direction, head) {
    const newPosition = Position.fromPosition(head.position);
    switch (direction) {
        case 'L':
            newPosition.column--;
            break;
        case 'R':
            newPosition.column++;
            break;
        case 'U':
            newPosition.line--;
            break;
        case 'D':
            newPosition.line++;
            break;
        default:
            throw new Error('Unknown direction');
    }
    head.lastPosition = Position.fromPosition(head.position);
    head.position = newPosition;
}

function getTailUniqueLocations(inputRows, numberOfEnds = 2, differentMovement = false) {
    const tailArray = [];
    for (let i = 0; i < numberOfEnds; i++) {
        tailArray.push(new RopeEnd(new Position(0, 0), new Position(0, 0)));
    }
    const head = tailArray[0];
    const lastTail = tailArray[numberOfEnds - 1];
    const lastTailPath = {};
    for (let row of inputRows) {
        const splitInput = row.split(' ');
        const count = parseInt(splitInput[1]);
        for (let i = 0; i < count; i++) {
            moveHead(splitInput[0], head);
            for (let tailIndex = 1; tailIndex < numberOfEnds; tailIndex++) {
                moveTail(tailArray[tailIndex - 1], tailArray[tailIndex], differentMovement);
            }
            // console.log(`Tail: ${lastTail.position.line} ${lastTail.position.column}`);
            lastTailPath[`${lastTail.position.line},${lastTail.position.column}`] = true;
        }
    }
    return lastTailPath;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

console.log(Object.keys(getTailUniqueLocations(input)).length);
