"use strict";
let diffRowCount = 1;


function simpleBoard() {
    const items = document.getElementById('simpleBoardGoals').getElementsByTagName('input');

    if (items.length < 25) {
        alert(`Please enter at least 25 items, you entered ${items.length} items.`); 
        return;
    }
    
    let jsonOutput = [];
    for (let i = 0; i < items.length; i++) {
        jsonOutput.push({name: items[i].value});
    }

    document.getElementById('simpleOutput').value = JSON.stringify(jsonOutput);
}

function diffBoard() {
    const text = parseDiff(document.getElementById("diffText"));
    const diffs = document.getElementById("srlIsaac").value == 0 ? 25 : 4;

    if (!validDiffInput(text, diffs)) return;

    /*
        Example JSON output:
        [
     
	        [ // Each list is a higher difficulty, this is difficulty 1
                {
	                "name": "test1",
	                "types": ["1"]
	            }, {
	                "name": "test2",
	                "types": ["2"]
	            }
            ], [ // Difficulty 2
	            {
	                "name": "test1",
	                "types": ["1", "2"]
	            }, {
	                "name": "test2",
	                "types": []
	            }
            ]
        ]
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

function addSimple() {
    const itemContainer = document.getElementById('simpleBoardGoals');
    /*
        To add:
        <div class="flex-row d-flex">
            <div class="pr-2 flex-grow-1">
                <input type="text" class="form-control" placeholder="Enter goal name here."></input>
            </div>
            <div class="pl-2">
                <button type="button" class="btn btn-danger">-</button>
            </div>
        </div>

        <br>
    */

    let newRow = document.createElement('div');
    newRow.setAttribute('class', 'flex-row d-flex');

    let newInputDiv = document.createElement('div');
    newInputDiv.setAttribute('class', 'pr-2 flex-grow-1');

    let newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('class', 'form-control');
    newInput.setAttribute('placeholder', 'Enter goal name here.');

    let newDeleteDiv = document.createElement('div');
    newDeleteDiv.setAttribute('class', 'pl-2');

    let newDelete = document.createElement('button');
    newDelete.setAttribute('type', 'button');
    newDelete.setAttribute('class', 'btn btn-danger');
    newDelete.innerHTML = "-";

    let newBr = document.createElement('br');   // Using a variable so we can delete it later


    newInputDiv.appendChild(newInput);
    newDeleteDiv.appendChild(newDelete);

    newRow.appendChild(newInputDiv);
    newRow.appendChild(newDeleteDiv);


    itemContainer.appendChild(newRow);
    itemContainer.appendChild(newBr);


    // Make delete button work
    newDelete.addEventListener('click', () => {
        newRow.remove();
        newBr.remove()
    });
}

function addDiff() {
    const itemContainer = document.getElementById('diffBoardGoals');
    /* 
        To Add:
        <div class="flex-row d-flex">
            <div class="pr-2 flex-grow-1">
                <input type="text" class="form-control" placeholder="Goal name"></input>
            </div>

            <div class="px-2 flex-shrink-1">
                <input type="number" class="form-control" placeholder="Difficulty" min="1" size="10"></input>
            </div>

            <!--   
                Unused for now, will implement later
            <div class="px-2 flex-shrink-1">
                <input type="text" class="form-control" placeholder="Types"></input>
            </div> -->

            <div class="pl-2" id="delDiff1">
                <button type="button" class="btn btn-danger">-</button>
            </div>
        </div>

        <br>
    */

    let newRow = document.createElement('div');
    newRow.setAttribute('class', 'flex-row d-flex');

    let newNameDiv = document.createElement('div');
    newNameDiv.setAttribute('class', 'pr-2 flex-grow-1');
    
    let newName = document.createElement('input');
    newName.setAttribute('type', 'text');
    newName.setAttribute('class', 'form-control');
    newName.setAttribute('placeholder', 'Goal name');

    let newDiffDiv = document.createElement('div');
    newDiffDiv.setAttribute('class', 'px-2 flex-shrink-1');

    let newDiff = document.createElement('input');
    newDiff.setAttribute('type', 'number');
    newDiff.setAttribute('class', 'form-control');
    newDiff.setAttribute('placeholder', 'Difficulty');
    newDiff.setAttribute('min', '1');
    newDiff.setAttribute('size', '10');

    // TODO: Implement types field in addDiff

    let newDeleteDiv = document.createElement('div');
    newDeleteDiv.setAttribute('class', 'pl-2');

    let newDelete = document.createElement('button');
    newDelete.setAttribute('type', 'button');
    newDelete.setAttribute('class', 'btn btn-danger');
    newDelete.innerHTML = "-";

    let newBr = document.createElement('br');   // Using a variable so we can delete it later


    newNameDiv.appendChild(newName);
    newDiffDiv.appendChild(newDiff);
    newDeleteDiv.appendChild(newDelete);

    newRow.appendChild(newNameDiv);
    newRow.appendChild(newDiffDiv);
    newRow.appendChild(newDeleteDiv);

    itemContainer.appendChild(newRow);
    itemContainer.appendChild(newBr);


    // Make delete button work
    newDelete.addEventListener('click', () => {
        newRow.remove();
        newBr.remove()
    });
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
    navigator.clipboard.writeText(text.value);

    button.innerHTML = "Copied!";
    setTimeout(function(){ button.innerHTML = "Copy" }, 2000);
}


document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('addSimple').addEventListener('click', addSimple);
    document.getElementById('addDiff').addEventListener('click', addDiff);

    document.getElementById('delSimple1').addEventListener('click', () => {
        document.getElementById('simpleRow1').remove();
        document.getElementById('simpleRowBr1').remove()
    });

    document.getElementById('delDiff1').addEventListener('click', () => {
        document.getElementById('diffRow1').remove();
        document.getElementById('diffRowBr1').remove()
    });

    document.getElementById('generateSimple').addEventListener('click', simpleBoard);
    document.getElementById('generateDiff').addEventListener('click', diffBoard);

    document.getElementById('copySimple').addEventListener('click', () => {
        copyText('simpleOutput', 'copySimple')
    });
    // document.getElementById('copyDiff').addEventListener('click', () => {
    //     copyText('diffOutput', 'copyDiff')
    // });
});
