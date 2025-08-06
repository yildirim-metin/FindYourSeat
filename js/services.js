import { RAW_URL_TABLE_PLAN } from "./constants.js";

export async function getTablePlan() {
    const res = await fetch(RAW_URL_TABLE_PLAN);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}