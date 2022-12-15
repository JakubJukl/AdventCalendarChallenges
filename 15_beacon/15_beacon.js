const fs = require('fs');

const BEACON = 'B';
const SENSOR = 'S';

function populateUnavailable(sX, sY, y, beacons, tillInc, tillDec) {
    for (let x = sX; x <= tillInc; x++) {
        if (!beacons[y]) beacons[y] = {};
        if (!beacons[y][x]) beacons[y][x] = '#';
    }
    for (let x = sX; x >= tillDec; x--) {
        if (!beacons[y]) beacons[y] = {};
        if (!beacons[y][x]) beacons[y][x] = '#';
    }
}

function loadBeacons(inputRows) {
    const beacons = {};
    for (let i = 0; i < inputRows.length; i++) {
        const [sX, sY, bX, bY] = inputRows[i].match(/-?\d+/g).map(Number);
        if (!beacons[sY]) beacons[sY] = {};
        beacons[sY][sX] = SENSOR;
        if (!beacons[bY]) beacons[bY] = {};
        beacons[bY][bX] = BEACON;

        const [minX, maxX] = [Math.min(sX, bX), Math.max(sX, bX)];
        const [minY, maxY] = [Math.min(sY, bY), Math.max(sY, bY)];
        const distance = Math.abs(maxX - minX) + Math.abs(maxY - minY);

        for (let y = sY; y <= sY + distance; y++) {
            const tillInc = sX + distance - (y - sY);
            const tillDec = sX - distance + (y - sY);
            populateUnavailable(sX, sY, y, beacons, tillInc, tillDec);
        }
        for (let y = sY; y >= sY - distance; y--) {
            const tillInc = sX + distance - (sY - y);
            const tillDec = sX - distance + (sY - y);
            populateUnavailable(sX, sY, y, beacons, tillInc, tillDec);
        }
    }
    return beacons;
}

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

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
if (input[input.length - 1].length === 0) input.pop();

console.log(countUnavailableAtLine(input, 2000000));
