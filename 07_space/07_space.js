const fs = require('fs');

/* Today was messy, had no time. */

function navigateToDir(home, currentFolder, dirName) {
    if (dirName === '..') {
        return currentFolder.parent;
    } else if (dirName === '/') {
        return home;
    } else {
        if (!currentFolder[dirName]) {
            return createDir(currentFolder, dirName, {});
        }
    }
}

function createDir(parentDir, name, content) {
    parentDir.content[name] = {
        content: content,
        parent: parentDir,
        size: 0,
    };
    return parentDir.content[name];
}

function constructOutput(isCmd, params, files = null, folders = null) {
    return {
        isCmd: isCmd,
        params: params,
        files: files,
        folders: folders
    };
}

function groupInput(inputRows) {
    const grouped = [];
    for (let i = 0; i < inputRows.length; i++) {
        if (inputRows[i].length > 0) {
            let splitRow = inputRows[i].split(' ');
            let output;
            if (splitRow[0] === '$') {
                if (splitRow[1] === 'cd') output = constructOutput(true, splitRow);
                else continue;
            } else {
                output = constructOutput(false, [], [], []);
                while (true) {
                    if (splitRow[0].match(/^[0-9]+$/)) output.files.push(splitRow);
                    else output.folders.push(splitRow);

                    if (inputRows[i + 1] && inputRows[i + 1].length > 0) {
                        splitRow = inputRows[i+1].split(' ');
                        if (splitRow[0] === '$') break;
                        i++;
                    } else break;
                }
            }
            grouped.push(output);
        }
    }
    return grouped;
}

function processInput(inputRows) {
    const root = {content: {}, size: 0};
    const home = createDir(root, '/', {});
    let currentFolder = home;
    const grouped = groupInput(inputRows);
    for (let i = 0; i < grouped.length; i++) {
        if (grouped[i].isCmd) {
            currentFolder = navigateToDir(home, currentFolder, grouped[i].params[2]);
        } else {
            if (grouped[i].files.length > 0) {
                let sum = 0;
                for (let j = 0; j < grouped[i].files.length; j++) {
                    currentFolder[grouped[i].files[j][1]] = grouped[i].files[j][0];
                    sum += parseInt(grouped[i].files[j][0]);
                }
                let folder = currentFolder;
                while (folder !== undefined) {
                    folder.size += sum;
                    folder = folder.parent;
                }
            }
        }
    }
    return root;
}

function findDirsBySize(root, max, includingSub, smaller = true) {
    const result = [];
    let folder = root;
    if (folder !== undefined) {
        const filesAndFolders = Object.keys(folder.content);
        for (let i = 0; i < filesAndFolders.length; i++) {
            const size = folder.content[filesAndFolders[i]].size;
            const sizeBool = smaller ? size <= max : size >= max;
            if (sizeBool) {
                result.push(size);
            }
            if (includingSub || !sizeBool) {
                result.push(...findDirsBySize(folder.content[filesAndFolders[i]], max, includingSub, smaller));
            }
        }
    }
    return result;
}

function sumSmallerEqFoldersSizes(root, max, includingSub = true) {
    const result = findDirsBySize(root, max, includingSub);
    return result.reduce((a, b) => a + b, 0);
}

function findHowMuchToDelete(root, diskSpace, needed) {
    const deleteMin = needed - (diskSpace - root.size);
    const allBiggerOrEqual = findDirsBySize(root, deleteMin, true, false);
    let min = allBiggerOrEqual[0];
    for (let i = 1; i < allBiggerOrEqual.length; i++) {
        if (allBiggerOrEqual[i] < min) min = allBiggerOrEqual[i];
    }
    return min;
}

const input = fs.readFileSync('input.txt', 'utf8').split('\r\n');
console.log(sumSmallerEqFoldersSizes(processInput(input), 100000));
console.log(findHowMuchToDelete(processInput(input), 70000000, 30000000));
