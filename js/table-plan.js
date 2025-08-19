import { searchResultsElement } from "./ui.js";
import { getTablePlan } from "./services.js";
import { langManager } from "../i18n/language-manager.js";

export async function renderTablePlan(numTable) {
    searchResultsElement.appendChild(renderTitle());

    const row = document.createElement('div');
    row.className = 'stage-table-row';

    row.appendChild(renderStage());
    row.appendChild(renderEmptySpace());
    row.appendChild(await renderTables(numTable));

    searchResultsElement.appendChild(row);

    langManager.updateContent();

    if(numTable) scrollToTable(numTable);
}

function renderTitle() {
    const title = document.createElement('h2');
    title.className = 'dancing-script-title';
    title.id = 'table-plan-title';
    title.setAttribute('data-i18n', 'tablePlanTitle');
    return title;
}

function renderStage() {
    const stage = document.createElement('div');
    stage.className = 'stage';
    stage.setAttribute('data-i18n', 'stage');
    return stage;
}

function getMaxTablePosition(data) {
    let maxPos = 0;
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (maxPos < element.position) {
            maxPos = element.position;
        }
    }
    return maxPos;
}

async function renderTables(numTable) {
    const data = await getTablePlan();
    const maxTablePosition = getMaxTablePosition(data);

    const tableColumn = initGridWithEmptySpaces(maxTablePosition);

    searchResultsElement.appendChild(tableColumn);

    replaceEmptySpacesByTables(maxTablePosition, data, numTable);
    
    return tableColumn;
}

function initGridWithEmptySpaces(maxTablePosition) {
    const tableColumn = document.createElement('div');
    tableColumn.className = 'table-column';

    for (let i = 0; i < maxTablePosition; i++) {
        tableColumn.appendChild(renderEmptySpace(i + 1));
        // if (i % 5 == 1) {
        //     tableColumn.appendChild(renderEmptySpace());
        // }
    }

    return tableColumn;
}

function renderEmptySpace(pos) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-div';
    if (pos) emptyDiv.setAttribute('data-pos', pos);
    return emptyDiv;
}

function replaceEmptySpacesByTables(maxTablePosition, data, numTable) {
    for (let index = 0; index < maxTablePosition; index++) {
        if (data[index]) {
            const table = document.querySelector('[data-pos="' + data[index].position + '"]');
            table.className = data[index].tableId == numTable ? 'table table-here' : 'table';
            table.setAttribute('data-i18n-table', 'yourHere');
            langManager.updateTableContent(table, data[index].tableId, data[index].tableId == numTable);
            table.id = "table-" + data[index].tableId;
        }
    }
}

function scrollToTable(numTable) {
    const tableToFocus = document.getElementById("table-" + numTable);
    tableToFocus.scrollIntoView({ behavior: 'smooth', block: 'start'});
}