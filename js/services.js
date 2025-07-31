export async function getTablePlan() {
    const res = await fetch('table-plan.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}