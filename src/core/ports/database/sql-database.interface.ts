export interface ISqlDatabase {
   query<T extends object>(query: string, params?: unknown[]): Promise<null>;
   query<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T, opts: { isArray: false }): Promise<T | null>;
   query<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T, opts: { isArray: true }): Promise<T[]>;
}