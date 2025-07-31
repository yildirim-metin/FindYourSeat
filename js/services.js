export async function getTablePlan() {
    const res = await fetch('./assets/table-plan.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}