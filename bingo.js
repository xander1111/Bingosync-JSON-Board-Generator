function simpleBoard() {
    const text = parseSimple(document.getElementById("simpleBoardText"));

    if (!validateLength(text)) return;
    
    let jsonOutput = [];
    text.forEach(item => {
        jsonOutput.push({name: item});
    });

    document.getElementById('simpleBoardOutput').value = JSON.stringify(jsonOutput);
}

function diffBoard() {
    const text = parseDiff(document.getElementById("diffText"));
    const diffs = document.getElementById("srlIsaac").value == 0 ? 25 : 4;

    if (!validDiffInput(text, diffs)) return;

    /*
     * Example JSON output:
     *  [
     * 
	 *      [ // Each list is a higher difficulty, this is difficulty 1
     *          {
	 *              "name": "test1",
	 *              "types": ["1"]
	 *          }, {
	 *              "name": "test2",
	 *              "types": ["2"]
	 *          }
     *      ], [ // Difficulty 2
	 *          {
	 *              "name": "test1",
	 *              "types": ["1", "2"]
	 *          }, {
	 *              "name": "test2",
	 *              "types": []
	 *          }
     *      ]
     * ]
     */

    let difficulties = getDiffSortedText(text, diffs);
    let jsonOutput = [];

    for (let i = 0; i < diffs; i++) {
        jsonOutput.push([]);

        difficulties[i].forEach(item => {
            let types = getTypes(item);

            jsonOutput[i].push({ name: item[0], types: types });
        });
    }

    document.getElementById("diffOutput").value = JSON.stringify(jsonOutput);
}

function parseSimple(text) {
    let splitText = text.value.split(",");

    let finalText = [];
    splitText.forEach(item => finalText.push(item.trim()));

    if (finalText[finalText.length - 1] == "") {
        // Removes an empty last entry in the case a comma is accidentally used after the last item.
        finalText.length -= 1;
    }

    return finalText;
}

function parseDiff(text) {
    let splitText = text.value.match(/"(.*)":([0-9]*)\[(.*)\]/gmi);

    finalText = [];
    splitText.forEach(item => {
        let srlRegExp = /"(.*)":([0-9]*)\[(.*)\]/gmi;
        let itemInfo = [];
        let  groups = srlRegExp.exec(item);

        for (let i = 0; i < 3; i++) {
            itemInfo.push(groups[i + 1]);
        }

        finalText.push(itemInfo);
    });

    return finalText;
}

function validateLength(input) {
    if (input.length < 25) {
        alert(`Please enter at least 25 items, you entered ${input.length} items.`);
        return false;
    }


    return true;
}

function validateDifficulties(input, diffs) {
    let invalidString = "Invalid difficulties:";
    let invalidFound = [];
    input.forEach(item => {
        let difficulty = item[1];
        if ((difficulty > diffs || difficulty < 1) && !invalidFound.includes(difficulty)) {
            invalidString += " " + item[1];
            invalidFound.push(item[1]);
        }
    });

    if (invalidFound.length > 0) {
        alert(`Please use only difficulties 1-${diffs}`);
        alert(invalidString);
        return false;
    }

    let difficulties = getDiffSortedText(input, diffs);

    let emptyDifficulties = [];
    for (let i = 0; i < diffs; i++) {
        if (difficulties[i].length == 0) {
            emptyDifficulties.push(i);
        }
    }
    if (emptyDifficulties.length > 0) {
        alert(`Please enter an item in all ${diffs} difficulties`);

        let missingString = "Difficulties missing an item:";
        emptyDifficulties.forEach(difficulty => {
            missingString += " " + (difficulty + 1);
        });

        alert(missingString);
        return false;
    }
    

    return true;
}

function validDiffInput(input, diffs) {
    if (!validateLength(input)) return false;
    if (!validateDifficulties(input, diffs)) return false;

    return true;
}

function getDiffSortedText(text, diffs) {
    let difficulties = [diffs];
    for (let i = 0; i < diffs; i++) {
        difficulties[i] = [];
    }

    text.forEach(item => {
        let itemDifficulty = parseInt(item[1]);

        difficulties[itemDifficulty - 1].push(item);
    });

    return difficulties;
}

function getTypes(item) {
    let types = item[2];
    types = types.split(",");

    let finalTypes = [];
    types.forEach(tag => {
        finalTypes.push(tag.trim());
    });

    return finalTypes;
}

function copyText(field, buttonPressed) {
    const text = document.getElementById(field);
    const button = document.getElementById(buttonPressed);

    text.select();
    document.execCommand("copy");

    button.innerHTML = "Copied!";
    setTimeout(function(){ button.innerHTML = "Copy" }, 2000);
}


document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('generateSimple').addEventListener('click', simpleBoard);
});
