const fs = require('fs');

function findMatchInLetterSequence(letterSequence, letter) {
    for (let i = 0; i < letterSequence.length; i++) {
        if (letterSequence[i].char === letter.char) return i;
    }
    return -1;
}

function getRidOfDuplicate(letterSequence, duplicateLetter) {
    const returnArray = [];
    let arrayIndex = 0;
    for (let letter of letterSequence) {
        if (letter.stringIndex > duplicateLetter.stringIndex) {
            letter.arrayIndex = arrayIndex;
            returnArray.push(letter);
            arrayIndex+=1;
        }
    }
    return returnArray;
}

function constructLetter(char, arrayIndex, stringIndex) {
    return {char: char, arrayIndex: arrayIndex, stringIndex: stringIndex};
}

function getIndexOfUniqueLetterSequence(wholeString, numberOfLetters) {
    let letterSequence = [];
    let letterSequenceIndex = 0;
    for (let i = 0; i < wholeString.length; i++) {
        const letter = constructLetter(wholeString[i], letterSequenceIndex, i);
        const foundIndex = findMatchInLetterSequence(letterSequence, letter);
        if (foundIndex === -1 && letterSequence.length === numberOfLetters - 1) {
            return letter.stringIndex + 1;
        } else if (foundIndex !== -1) {
            letterSequence = getRidOfDuplicate(letterSequence, letterSequence[foundIndex]);
            if (letterSequence.length !== numberOfLetters - 1) letterSequenceIndex = letterSequence.length;
        }
        letterSequence[letterSequenceIndex] = letter;
        letterSequenceIndex+=1;
        if (letterSequenceIndex === numberOfLetters - 1) letterSequenceIndex = 0;
    }
    throw new Error('No unique letter sequence found');
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(getIndexOfUniqueLetterSequence(input[0], 4));
