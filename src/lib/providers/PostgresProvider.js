// Класс для работы с БД
  export class PostgresProvider {
    static ignoreTables = [
      //"spatial_ref_sys",
      //"geography_columns",
      //"geometry_columns",
      //"pg_stat_statements_info",
      //"raster_columns",
      //"pg_stat_statements",
    ];

    static async getDbName() {
      const response = await fetch("/api/home/getDatabaseName");
      return (await response.json()).database;
    }

    static async getTablesList(ignoreTables = []) {
      const response = await fetch("/api/home/getTablesList");
      const tables = await response.json();
      return tables.filter((table) => !ignoreTables.includes(table.table_name));
    }

    static async getColumnsList(tableName) {
      const response = await fetch(
        `/api/home/getColumnsList?table=${tableName}`
      );
      return await response.json();
    }
  }
