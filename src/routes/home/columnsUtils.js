import { PostgresProvider } from "$lib/providers/PostgresProvider";

export async function loadColumns(tableName, columns, columnsList) {
    try {
        columnsList = await PostgresProvider.getColumnsList(tableName);
        columns = columnsListToColumns(columns, columnsList);
    } catch (error) {
        console.error("Error loading columns:", error);
    }

    return columns;
}

export function columnsListToColumns(columns, columnsList) {
// Преобразуем в нужный формат
columns = columnsList.map((col) => ({
    field: col.column_name,
    header: formatHeader(col.column_name), // Функция для форматирования заголовка
    width: "7.5rem", // Можно настроить индивидуально
}));

return columns;
}

// Функция для форматирования названий колонок (например, "user_name" → "User Name")
export function formatHeader(columnName) {
return columnName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}