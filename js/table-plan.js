import { resultsEl } from "./ui.js";

export function renderTablePlan(numTable) {
    const row = document.createElement('div');
    row.className = 'stage-table-row';

    row.appendChild(renderStage());
    row.appendChild(renderEmptySpace());
    row.appendChild(renderTables(numTable));
    
    resultsEl.appendChild(row);
}

function renderTables(numTable) {
    if (numTable == 0) return;

    const tableColumn = document.createElement('div');
    tableColumn.className = 'table-column';

    let tmp = 2;
    for (let i = 0; i < 25; i++) {
        if (i == 2 || (i >= 6 && i == tmp + 4)) {
            tableColumn.appendChild(renderEmptySpace());
            tmp = i == 2 ? tmp : tmp + 4;
        }

        tableColumn.appendChild(renderTableAtPosition(i, numTable));
    }

    return tableColumn;
}

function renderStage() {
    const stage = document.createElement('div');
    stage.className = 'stage';
    stage.textContent = 'Scène';

    return stage;
}

function renderTableAtPosition(pos, numTable) {
    pos += 1;
    
    const table = document.createElement('div');
    table.className = pos == numTable ? 'table table-here' : 'table';
    table.textContent = pos == numTable ? 'Tu es ici !' : pos;
    return table;
}

function renderEmptySpace() {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-div';
    return emptyDiv;
}