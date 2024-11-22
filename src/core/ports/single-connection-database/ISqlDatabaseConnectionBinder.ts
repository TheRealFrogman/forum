import { ISqlDatabase } from "../sql-database/sql-database.interface";

export abstract class ISqlDatabaseConnectionBinder {
   abstract connect(): Promise<ISqlDatabase & { release: (err?: Error | boolean) => Promise<void> }>
}