function simpleBoard() {
    const text = parseSimple(document.getElementById("simpleBoardText"));

    if (text.length < 25) {
        alert(`Please enter at least 25 items, you entered ${text.length} items.`);
        return;
    }
    
    var jsonOutput = [];
    text.forEach(item => {
        jsonOutput.push({name: item});
    });
    document.getElementById("simpleBoardOutput").value = JSON.stringify(jsonOutput);
}

function diffBoard() {
    const text = parseDiff(document.getElementById("srlText"));
    var diffs = document.getElementById("srlIsaac").value == 0 ? 25 : 4;

    if (text.length < 25) {
        alert(`Please enter at least 25 items, you entered ${text.length} items.`);
        return;
    }

    var invalidString = "Invalid difficulties:";
    var invalidFound = [];
    text.forEach(item => {
        var difficulty = item[1];
        if ((difficulty > diffs || difficulty < 1) && !invalidFound.includes(difficulty)) {
            invalidString += " " + item[1];
            invalidFound.push(item[1]);
        }
    });

    if (invalidFound.length > 0) {
        alert(`Please use only difficulties 1-${diffs}`);
        alert(invalidString);
        return;
    }

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

    var difficulties = sortDifficulties(text, diffs);

    var emptyDifficulties = [];
    for (let i = 0; i < diffs; i++) {
        if (difficulties[i].length == 0) {
            emptyDifficulties.push(i);
        }
    }
    if (emptyDifficulties.length > 0) {
        alert(`Please enter an item in all ${diffs} difficulties`);

        var missingString = "Difficulties missing an item:";
        emptyDifficulties.forEach(difficulty => {
            missingString += " " + (difficulty + 1);
        });

        alert(missingString);
        return;
    }


    var jsonOutput = [];

    for (let i = 0; i < diffs; i++) {
        jsonOutput.push([]);

        difficulties[i].forEach(item => {
            var types = getTypes(item);

            jsonOutput[i].push({ name: item[0], types: types });
        });
    }

    document.getElementById("srlBoardOutput").value = JSON.stringify(jsonOutput);
}

function parseSimple(text) {
    var splitText = text.value.split(",");

    var finalText = [];
    splitText.forEach(item => finalText.push(item.trim()));

    if (finalText[finalText.length - 1] == "") {
        // Removes an empty last entry in the case a comma is accidentally used after the last item.
        finalText.length -= 1;
    }

    return finalText;
}

function parseDiff(text) {
    var splitText = text.value.match(/"(.*)":([0-9]*)\[(.*)\]/gmi);

    finalText = [];
    splitText.forEach(item => {
        var srlRegExp = /"(.*)":([0-9]*)\[(.*)\]/gmi;
        var itemInfo = [];
        var groups = srlRegExp.exec(item);

        for (let i = 0; i < 3; i++) {
            itemInfo.push(groups[i + 1]);
        }

        finalText.push(itemInfo);
    });

    return finalText;
}

function sortDifficulties(text, diffs) {
    var difficulties = [diffs];
    for (let i = 0; i < diffs; i++) {
        difficulties[i] = [];
    }

    text.forEach(item => {
        var itemDifficulty = parseInt(item[1]);

        difficulties[itemDifficulty - 1].push(item);
    });

    return difficulties;
}

function getTypes(item) {
    var types = item[2];
    types = types.split(",");

    var finalTypes = [];
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

    button.value = "Copied!";
    setTimeout(function(){ button.value = "Copy" }, 2000);
}
