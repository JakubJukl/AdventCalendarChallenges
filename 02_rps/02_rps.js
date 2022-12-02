const fs = require('fs');

const rockOpponent = 'A';
const paperOpponent = 'B';
const scissorsOpponent = 'C';
const rockPlayer = 'X';
const paperPlayer = 'Y';
const scissorsPlayer = 'Z';

const needLoose = 'X';
const needDraw = 'Y';
const needWin = 'Z';

const loss = 0;
const draw = 3;
const win = 6;

const player = {};
player[rockPlayer] = 1;
player[paperPlayer] = 2;
player[scissorsPlayer] = 3;

const opponent = {};
opponent[rockOpponent] = 1;
opponent[paperOpponent] = 2;
opponent[scissorsOpponent] = 3;

const playerWinCondition = {}
playerWinCondition[rockPlayer] = scissorsOpponent;
playerWinCondition[paperPlayer] = rockOpponent;
playerWinCondition[scissorsPlayer] = paperOpponent;

const opponentWinCondition = {}
opponentWinCondition[rockOpponent] = scissorsPlayer;
opponentWinCondition[paperOpponent] = rockPlayer;
opponentWinCondition[scissorsOpponent] = paperPlayer;

const playerMoveToWin = {};
playerMoveToWin[rockOpponent] = paperPlayer;
playerMoveToWin[paperOpponent] = scissorsPlayer;
playerMoveToWin[scissorsOpponent] = rockPlayer;

const playerMoveToDraw = {};
playerMoveToDraw[rockOpponent] = rockPlayer;
playerMoveToDraw[paperOpponent] = paperPlayer;
playerMoveToDraw[scissorsOpponent] = scissorsPlayer;

const matchingStrategyDict = {};
matchingStrategyDict[needLoose] = opponentWinCondition;
matchingStrategyDict[needDraw] = playerMoveToDraw;
matchingStrategyDict[needWin] = playerMoveToWin;

function roundOutcome(playerMove, opponentMove) {
    if (player[playerMove] === opponent[opponentMove]) {
        return draw;
    } else if (playerWinCondition[playerMove] === opponentMove) {
        return win;
    } else {
        return loss;
    }
}

function getRoundMoves(row) {
    // arr[0] = opponent move, arr[1] = player move
    return row.split(' ');
}

function getTotalPlayerScore(inputRows) {
    let totalScore = 0;
    for (let row of inputRows) {
        if (row.length === 0) {
            break;
        }
        const roundMoves = getRoundMoves(row);
        totalScore += roundOutcome(roundMoves[1], roundMoves[0]) + player[roundMoves[1]];
    }
    return totalScore;
}

function getTotalPlayerScoreAfterUpdate(inputRows) {
    let totalScore = 0;
    for (let row of inputRows) {
        if (row.length === 0) {
            break;
        }
        const roundMoves = getRoundMoves(row);
        const strategy = matchingStrategyDict[roundMoves[1]];
        const playerMove = strategy[roundMoves[0]];
        totalScore += roundOutcome(playerMove, roundMoves[0]) + player[playerMove];
    }
    return totalScore;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(getTotalPlayerScore(input));
console.log(getTotalPlayerScoreAfterUpdate(input));
