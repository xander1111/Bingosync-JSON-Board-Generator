"use strict";


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
    const goals = [];
    document.getElementsByName('diffInputGoal').forEach(goal => goals.push(goal.value));
    const diffs = [];
    document.getElementsByName('diffInputDiff').forEach(diff => diffs.push(parseInt(diff.value)));
    const types = [];
    document.getElementsByName('diffInputTypes').forEach(type => types.push(type.value));

    const isIsaac = document.getElementById("srlIsaac").value
    const validDiffs = isIsaac == 0 ? 25 : 4;
    const items = createItemsArray(goals, diffs, types, isIsaac);

    if (!validDiffInput(items, validDiffs)) return;

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

    let difficulties = getDiffSortedText(items, validDiffs);
    let jsonOutput = [];

    for (let i = 0; i < validDiffs; i++) {
        jsonOutput.push([]);

        difficulties[i].forEach(item => {
            if (isIsaac) {
            jsonOutput[i].push({ name: item[0]});
            } else {
            let types = getTypes(item);

            jsonOutput[i].push({ name: item[0], types: types });
            }

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
                <input type="text" class="form-control" name="diffInputGoal" placeholder="Goal name"></input>
            </div>

            <div class="px-2 flex-shrink-1">
                <input type="number" class="form-control" name="diffInputDiff" placeholder="Difficulty" min="1" size="10"></input>
            </div>

            <div class="px-2 flex-shrink-1">
                <input type="text" class="form-control" name="diffInputTypes" placeholder="Types"></input>
            </div>

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
    newName.setAttribute('name', 'diffInputGoal');

    let newDiffDiv = document.createElement('div');
    newDiffDiv.setAttribute('class', 'px-2 flex-shrink-1');

    let newDiff = document.createElement('input');
    newDiff.setAttribute('type', 'number');
    newDiff.setAttribute('class', 'form-control');
    newDiff.setAttribute('placeholder', 'Difficulty');
    newDiff.setAttribute('min', '1');
    newDiff.setAttribute('size', '10');
    newDiff.setAttribute('name', 'diffInputDiff');

    let newTypeDiv = document.createElement('div');
    newTypeDiv.setAttribute('class', 'px-2 flex-shrink-1');

    let newType = document.createElement('input');
    newType.setAttribute('type', 'text');
    newType.setAttribute('class', 'form-control');
    newType.setAttribute('placeholder', 'Types');
    newType.setAttribute('name', 'diffInputTypes');

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
    newTypeDiv.appendChild(newType);

    newRow.appendChild(newNameDiv);
    newRow.appendChild(newDiffDiv);
    newRow.appendChild(newTypeDiv);
    newRow.appendChild(newDeleteDiv);

    itemContainer.appendChild(newRow);
    itemContainer.appendChild(newBr);


    // Make delete button work
    newDelete.addEventListener('click', () => {
        newRow.remove();
        newBr.remove()
    });
}

function createItemsArray(goals, diffs, types, isIsaac) {
    /* 
    Returns an array created from goals, diffs, and types (if not isaac).
    Each item formatted as: [goalName, diff, types]
    */
    let items = [];
    for (let i = 0; i < goals.length; i++) {
        let item = [goals[i], diffs[i]];
        if (!isIsaac) item.push(types[i]);
        items.push(item);
    }

    console.log(items);

    return items;
}

function validateDifficulties(input, validDiffs) {
    let diffsUsed = new Set();
    input.forEach(item => {
        diffsUsed.add(item[1]);
    });
    diffsUsed = Array.from(diffsUsed);

    let invalidString = "Invalid difficulties:";
    let invalidFound = false;
    diffsUsed.forEach(diff => {
        if (diff > validDiffs || diff < 1) {
            invalidString += " " + diff;
            invalidFound = true;
        }
    });

    if (invalidFound) {
        alert(`Please use only difficulties 1-${validDiffs}`);
        alert(invalidString);
        return false;
    }

    let emptyDifficulties = [];
    for (let i = 1; i <= validDiffs; i++) {
        if (!diffsUsed.includes(i)) {
            emptyDifficulties.push(i);
        }
    }

    if (emptyDifficulties.length > 0) {
        alert(`Please enter an item in all ${validDiffs} difficulties`);

        let missingString = "Difficulties missing an item:";
        emptyDifficulties.forEach(difficulty => {
            missingString += " " + (difficulty);
        });

        alert(missingString);
        return false;
    }
    
    return true;
}

function validDiffInput(input, validDiffs) {
    if (input.length < 25) {
        alert(`Please enter at least 25 items, you entered ${input.length} items.`); 
        return;
    }
    if (!validateDifficulties(input, validDiffs)) return false;

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
    document.getElementById('copyDiff').addEventListener('click', () => {
        copyText('diffOutput', 'copyDiff')
    });
});
