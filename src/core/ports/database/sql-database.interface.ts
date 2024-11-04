export interface ISqlDatabase {
   query<T extends object>(query: string, params?: unknown[], cls?: new (...args: any[]) => T,): Promise<T | T[] | null>;
}