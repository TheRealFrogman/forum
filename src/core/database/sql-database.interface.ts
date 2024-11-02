export interface ISqlDatabase {
   query<T>(query: string, params?: unknown[], cls?: new (...args: any[]) => T,): Promise<T | T[] | null>;
}