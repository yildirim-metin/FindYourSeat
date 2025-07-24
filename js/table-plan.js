import { resultsEl } from "./ui.js";

export function renderTables(numTable) {
    console.log(numTable);
    if (numTable == 0) return;

    const tableColumn = document.createElement('div');
    tableColumn.className = 'container';

    let tmp = 2;
    for (let i = 0; i < 25; i++) {
        if (i == 2 || (i >= 6 && i == tmp + 4)) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-div';
            tableColumn.appendChild(emptyDiv);
            tmp = i == 2 ? tmp : tmp + 4;
        }

        const divTable = document.createElement('div');
        divTable.className = i + 1 == numTable ? 'table-here' : 'table';
        divTable.textContent = i + 1 == numTable ? 'Tu es ici !' : i + 1;
        tableColumn.appendChild(divTable);
    }

    resultsEl.appendChild(tableColumn);
}