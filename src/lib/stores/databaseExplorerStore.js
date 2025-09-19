// src/lib/stores/databaseStores.js
import { writable } from 'svelte/store';
import { PostgresProvider } from '$lib/providers/PostgresProvider';

// Отдельные хранилища для каждой переменной
export const databaseName = writable('');
export const tablesList = writable([{ table_name: '' }]);
export const selectedTable = writable('');
export const columnsList = writable([{}]);
export const columns = writable([{}]);

// Функция для форматирования заголовков
const formatHeader = (columnName) => {
  return columnName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Методы для работы с хранилищами
export const databaseActions = {
  async loadDatabase() {
    const name = await PostgresProvider.getDbName();
    databaseName.set(name);
    
    let tables = await PostgresProvider.getTablesList(PostgresProvider.ignoreTables);
    tables = tables.filter(table => 
      !PostgresProvider.ignoreTables.includes(table.table_name)
    );
    
    tablesList.set(tables);
    
    if (tables.length > 0) {
      await this.loadTableColumns(tables[0].table_name);
    }
  },

  async loadTableColumns(tableName) {
    const list = await PostgresProvider.getColumnsList(tableName);
    columnsList.set(list);
    
    const formattedColumns = list.map(col => ({
      field: col.column_name,
      header: formatHeader(col.column_name),
      width: "7.5rem"
    }));
    
    columns.set(formattedColumns);
  }
};