const fs = require('fs');

const BEACON = 'B';
const SENSOR = 'S';

class Sensor {
    constructor(x, y, beacon) {
        this.x = x;
        this.y = y;
        this.beacon = beacon;
        this.distance = getDistance(x, y, beacon.x, beacon.y);
    }
}

class Beacon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function loadSensorsToArray(inputRows) {
    const sensors = [];
    for (let i = 0; i < inputRows.length; i++) {
        const [sX, sY, bX, bY] = inputRows[i].match(/-?\d+/g).map(Number);
        sensors.push(new Sensor(sX, sY, new Beacon(bX, bY)));
    }
    return sensors;
}

function getDistance(startX, startY, endX, endY) {
    return Math.abs(endX - startX) + Math.abs(endY - startY);
}

function isInDistance(startX, startY, checkX, checkY, distance) {
    return getDistance(startX, startY, checkX, checkY) <= distance;
}

function setUnavailable(sensor, beacon, x, y, row) {
    if (sensor.x === x && sensor.y === y) {
        row[x] = SENSOR;
    } else if (beacon.x === x && beacon.y === y) {
        row[x] = BEACON;
    } else if (!row[x]) {
        row[x] = '#';
    }
}

function setUnavailableAtRow(sensors, y) {
    const row = {};
    for (let i = 0; i < sensors.length; i++) {
        const sensor = sensors[i];
        const beacon = sensor.beacon;
        let x = sensor.x;
        while(isInDistance(sensor.x, sensor.y, x, y, sensor.distance)) {
            setUnavailable(sensor, beacon, x, y, row);
            x++;
        }
        x = sensor.x - 1;
        while(isInDistance(sensor.x, sensor.y, x, y, sensor.distance)) {
            setUnavailable(sensor, beacon, x, y, row);
            x--;
        }
    }
    return row;
}

function countUnavailableAtLine(inputRows, y) {
    const sensors = loadSensorsToArray(inputRows);
    const row = setUnavailableAtRow(sensors, y);
    const keys = Object.keys(row).map(Number).sort((a, b) => a - b);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
        if (row[keys[i]] === '#') {
            count++;
        }
    }
    return count;
}

function isDistressBeacon(sensors, x, y, i) {
    for (let j = 0; j < sensors.length; j++) {
        if (j !== i) {
            const otherSensor = sensors[j];
            if (isInDistance(x, y, otherSensor.x, otherSensor.y, otherSensor.distance)) {
                return false;
            }
        }
    }
    return true;
}

function findDistressBeaconLocation(sensors, leftEdge, rightEdge) {
    for (let i = 0; i < sensors.length; i++) {
        const sensor = sensors[i];
        for (let y = sensor.y; y <= sensor.y + sensor.distance + 1; y++) {
            if (y >= leftEdge && y <= rightEdge) {
                const xCoords = [sensor.x + sensor.distance + 1 - (y - sensor.y),
                    sensor.x - sensor.distance - 1 + (y - sensor.y)]
                for (let x of xCoords) {
                    if (x >= leftEdge && x <= rightEdge && isDistressBeacon(sensors, x, y, i)) return [x, y];
                }
            }
        }
        for (let y = sensor.y; y >= sensor.y - sensor.distance - 1; y--) {
            if (y >= leftEdge && y <= rightEdge) {
                const xCoords = [sensor.x + sensor.distance  + 1 - (sensor.y - y),
                    sensor.x - sensor.distance - 1 + (sensor.y - y)];
                for (let x of xCoords) {
                    if (x >= leftEdge && x <= rightEdge && isDistressBeacon(sensors, x, y, i)) return [x, y];
                }
            }
        }
    }
}

function findDistressBeaconTuningFrequency(inputRows, leftEdge, rightEdge) {
    const sensors = loadSensorsToArray(inputRows);
    const [x, y] = findDistressBeaconLocation(sensors, leftEdge, rightEdge);
    return x * 4000000 + y;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

console.log(countUnavailableAtLine(input, 2000000));
console.log(findDistressBeaconTuningFrequency(input, 0, 4000000));
