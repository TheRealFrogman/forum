export abstract class PgCursorDatabase {
   abstract queryCursor<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T): Promise<{ read: (amount: number) => Promise<T[]> }>;
}